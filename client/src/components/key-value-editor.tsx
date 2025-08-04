import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueEditorProps) {
  const updatePair = (index: number, field: "key" | "value", newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: newValue };
    onChange(newPairs);
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    onChange(newPairs);
  };

  const addPair = () => {
    onChange([...pairs, { key: "", value: "" }]);
  };

  return (
    <div className="space-y-3">
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Input
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => updatePair(index, "key", e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Input
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => updatePair(index, "value", e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePair(index)}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={addPair}
        className="text-blue-500 hover:text-blue-700 flex items-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {keyPlaceholder}
      </Button>
    </div>
  );
}
