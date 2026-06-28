import { useCallback } from 'react';
import { Box, SimpleGrid, Text, Spinner, Center, VStack, HStack } from '@chakra-ui/react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { FiArchive, FiEdit3 } from 'react-icons/fi';
import { BsPinFill } from 'react-icons/bs';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, onEdit, onDelete, onTogglePin, onChangeColor, onStatusChange, onPriorityChange, onSelect, onReorder }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);
    if (!activeTask || !overTask) return;

    const sectionKey = (t) => t.pinned ? 'pinned' : (t.status === 'dropped' || t.status === 'pending') ? 'dropped' : 'active';
    if (sectionKey(activeTask) !== sectionKey(overTask)) return;

    const section = tasks.filter((t) => sectionKey(t) === sectionKey(activeTask));
    const oldIdx = section.findIndex((t) => t._id === active.id);
    const newIdx = section.findIndex((t) => t._id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(section, oldIdx, newIdx);
    const updates = reordered.map((t, i) => ({ _id: t._id, order: i }));
    onReorder(updates);
  }, [tasks, onReorder]);

  if (loading) {
    return <Center py={20}><Spinner size="xl" color="#6366f1" thickness="3px" speed="0.7s" /></Center>;
  }

  const pinned = tasks.filter((t) => t.pinned);
  const active = tasks.filter((t) => !t.pinned && t.status !== 'dropped' && t.status !== 'pending');
  const dropped = tasks.filter((t) => !t.pinned && (t.status === 'dropped' || t.status === 'pending'));

  if (tasks.length === 0) {
    return (
      <Center py={20}>
        <VStack spacing={3}>
          <Box
            w="56px" h="56px"
            rounded="2xl"
            bg="rgba(99, 102, 241, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiEdit3 size="24px" color="#6366f1" />
          </Box>
          <Text color="gray.500" fontSize="md" fontWeight="500">No notes yet</Text>
          <Text color="gray.600" fontSize="sm">Tap above to create your first note</Text>
        </VStack>
      </Center>
    );
  }

  const renderCard = (task) => (
    <TaskCard
      key={task._id}
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      onTogglePin={onTogglePin}
      onChangeColor={onChangeColor}
      onStatusChange={onStatusChange}
      onPriorityChange={onPriorityChange}
      onSelect={onSelect}
    />
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {pinned.length > 0 && (
        <Box mb={6}>
          <HStack spacing={2} mb={3} ml={1}>
            <BsPinFill size="13px" color="#facc15" />
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" fontWeight="600">
              Pinned
            </Text>
            <Text fontSize="xs" color="gray.600">({pinned.length})</Text>
          </HStack>
          <SortableContext items={pinned.map((t) => t._id)} strategy={rectSortingStrategy}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
              {pinned.map(renderCard)}
            </SimpleGrid>
          </SortableContext>
        </Box>
      )}

      <SortableContext items={active.map((t) => t._id)} strategy={rectSortingStrategy}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {active.map(renderCard)}
        </SimpleGrid>
      </SortableContext>

      {dropped.length > 0 && (
        <Box mt={8}>
          <HStack spacing={2} mb={3} ml={1}>
            <FiArchive size="13px" color="#6b7280" />
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500" fontWeight="600">
              Archive
            </Text>
            <Text fontSize="xs" color="gray.600">({dropped.length})</Text>
          </HStack>
          <SortableContext items={dropped.map((t) => t._id)} strategy={rectSortingStrategy}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
              {dropped.map(renderCard)}
            </SimpleGrid>
          </SortableContext>
        </Box>
      )}
    </DndContext>
  );
}
