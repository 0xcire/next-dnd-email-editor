"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  DropAnimation,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

// Define types for the props of the components
interface SortableItemProps {
  id: string;
}

interface DroppableZoneProps {
  id: string;
  items: string[];
}

function SortableItem({ id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    transition,
    margin: "8px",
    padding: "16px",
    border: "1px solid black",
    backgroundColor: "lightgrey",
    cursor: "move",
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      Item {id}
    </div>
  );
}

function DroppableZone({ id, items }: DroppableZoneProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "100px",
        padding: "16px",
        border: "1px solid blue",
        margin: "8px",
        backgroundColor: "lightblue",
        flex: "1 1 0",
      }}
    >
      <h3>Drop Zone {id}</h3>
      <SortableContext
        items={items}
        // strategy={sortableKeyboardCoordinates}
      >
        {items.map((item) => (
          <SortableItem key={item} id={item} />
        ))}
      </SortableContext>
    </div>
  );
}

function App() {
  const [droppableZones, setDroppableZones] = useState<string[]>([]);
  const [items, setItems] = useState<Record<string, string[]>>({});

  const handleAddZone = () => {
    const newZoneId = `zone${droppableZones.length + 1}`;
    setDroppableZones([...droppableZones, newZoneId]);
    setItems((prevItems) => ({
      ...prevItems,
      [newZoneId]: [], // Initialize new zone with an empty list of items
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const activeZone = Object.keys(items).find((key) =>
        items[key].includes(active.id)
      );
      const overZone = over.id;

      if (activeZone && overZone) {
        setItems((prevItems) => {
          const updatedItems = { ...prevItems };
          updatedItems[activeZone] = updatedItems[activeZone].filter(
            (item) => item !== active.id
          );
          updatedItems[overZone] = [...updatedItems[overZone], active.id];
          return updatedItems;
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <button onClick={handleAddZone}>Add Droppable Zone</button>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {droppableZones.map((zoneId) => (
            <DroppableZone
              key={zoneId}
              id={zoneId}
              items={items[zoneId] || []}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default App;
