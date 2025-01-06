"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "nose",
    label: "Nose",
  },
  {
    value: "left_eye",
    label: "Left Eye",
  },
  {
    value: "right_eye",
    label: "Right Eye",
  },
  {
    value: "left_ear",
    label: "Left Ear",
  },
  {
    value: "right_ear",
    label: "Right Ear",
  },
  {
    value: "left_shoulder",
    label: "Left Shoulder",
  },
  {
    value: "right_shoulder",
    label: "Right Shoulder",
  },
  {
    value: "left_elbow",
    label: "Left Elbow",
  },
  {
    value: "right_elbow",
    label: "Right Elbow",
  },
  {
    value: "left_wrist",
    label: "Left Wrist",
  },
  {
    value: "right_wrist",
    label: "Right Wrist",
  },
  {
    value: "left_hip",
    label: "Left Hip",
  },
  {
    value: "right_hip",
    label: "Right Hip",
  },
  {
    value: "left_knee",
    label: "Left Knee",
  },
  {
    value: "right_knee",
    label: "Right Knee",
  },
  {
    value: "left_ankle",
    label: "Left Ankle",
  },
  {
    value: "right_ankle",
    label: "Right Ankle",
  }
]

interface TrackingSelectorProps {
  disabled?: boolean;
  title: string;
  item: string;
  setTrackingPoint?: (data: string) => void;
}

export function TrackingSelector({ disabled, title, item, setTrackingPoint }: TrackingSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {
            value
              ? frameworks.find((framework) => framework.value === value)?.label
              : title
          }

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${item}...`} className="h-9" />

          <CommandList>
            <CommandEmpty>No {item} found.</CommandEmpty>

            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setTrackingPoint(currentValue)
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
