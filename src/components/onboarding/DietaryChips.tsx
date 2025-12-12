import React from "react";
import { cn } from "@/lib/utils";
import { Leaf, Carrot, Flame, Wheat, Milk, XCircle } from "lucide-react";

interface DietaryChipsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

const dietaryOptions = [
  { id: "vegan", label: "Vegano", icon: Leaf },
  { id: "vegetarian", label: "Vegetariano", icon: Carrot },
  { id: "keto", label: "Keto", icon: Flame },
  { id: "gluten-free", label: "Sem Glúten", icon: Wheat },
  { id: "lactose-free", label: "Sem Lactose", icon: Milk },
  { id: "none", label: "Nenhuma", icon: XCircle },
];

export const DietaryChips: React.FC<DietaryChipsProps> = ({
  selected,
  onChange,
  className,
}) => {
  const handleToggle = (id: string) => {
    if (id === "none") {
      // If "None" is selected, clear all others
      onChange(selected.includes("none") ? [] : ["none"]);
      return;
    }

    // If selecting something other than "none", remove "none" from selection
    let newSelected = selected.filter(s => s !== "none");

    if (newSelected.includes(id)) {
      newSelected = newSelected.filter(s => s !== id);
    } else {
      newSelected = [...newSelected, id];
    }
    onChange(newSelected);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {dietaryOptions.map(({ id, label, icon: Icon }) => {
        const isSelected = selected.includes(id);

        return (
          <button
            key={id}
            onClick={() => handleToggle(id)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 text-left",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 flex-shrink-0",
              isSelected ? "text-white" : "text-foreground"
            )} />
            <span className="text-sm font-medium">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
