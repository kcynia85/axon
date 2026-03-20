import React from "react";
import { Select, SelectItem, Input } from "@heroui/react";

export function Test() {
  const [capabilitySearch, setCapabilitySearch] = React.useState("");

  return (
    <Select
        label="Test"
        listboxProps={{
            topContent: (
                <div className="p-2 border-b border-zinc-800">
                    <Input
                        size="sm"
                        placeholder="Search capability..."
                        value={capabilitySearch}
                        onChange={(e) => setCapabilitySearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter" && e.key !== "Escape") {
                                e.stopPropagation();
                            }
                        }}
                    />
                </div>
            )
        }}
    >
        <SelectItem key="1">1</SelectItem>
    </Select>
  );
}
