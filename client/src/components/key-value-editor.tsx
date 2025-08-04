import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
  enabled: boolean;
}

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  placeholder?: { key: string; value: string };
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueEditor({ pairs, onChange, placeholder, keyPlaceholder, valuePlaceholder }: KeyValueEditorProps) {
  const addPair = () => {
    onChange([
      ...pairs,
      { key: "", value: "", enabled: true }
    ]);
  };

  const updatePair = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    onChange(newPairs);
  };

  const removePair = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={(e) => updatePair(index, "enabled", e.target.checked)}
            className="rounded border-slate-300"
          />
          <Input
            placeholder={keyPlaceholder || placeholder?.key || "Key"}
            value={pair.key}
            onChange={(e) => updatePair(index, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder={valuePlaceholder || placeholder?.value || "Value"}
            value={pair.value}
            onChange={(e) => updatePair(index, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePair(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addPair}
        className="w-full"
      >
        <Plus size={16} className="mr-2" />
        Add {placeholder?.key || "Parameter"}
      </Button>
    </div>
  );
}