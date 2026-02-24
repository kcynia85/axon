import React from "react";
import { Select, SelectItem, SelectSection, Input, Button } from "@heroui/react";

export function Test() {
  const [capabilitySearch, setCapabilitySearch] = React.useState("");
  const filtered = [{ key: 'a', label: 'a' }];

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
                    />
                </div>
            )
        }}
    >
        {filtered.length > 0 ? (
            <SelectItem key="1" textValue="1">1</SelectItem>
        ) : (
            <SelectItem key="create" textValue={capabilitySearch}>
                Press Enter to create &#34;{capabilitySearch}&#34;
            </SelectItem>
        )}
    </Select>
  );
}
