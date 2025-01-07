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
    value: "leftEye",
    label: "Left Eye",
  },
  {
    value: "rightEye",
    label: "Right Eye",
  },
  {
    value: "leftEar",
    label: "Left Ear",
  },
  {
    value: "rightEar",
    label: "Right Ear",
  },
  {
    value: "leftShoulder",
    label: "Left Shoulder",
  },
  {
    value: "rightShoulder",
    label: "Right Shoulder",
  },
  {
    value: "leftElbow",
    label: "Left Elbow",
  },
  {
    value: "rightElbow",
    label: "Right Elbow",
  },
  {
    value: "leftWrist",
    label: "Left Wrist",
  },
  {
    value: "rightWrist",
    label: "Right Wrist",
  },
  {
    value: "leftHip",
    label: "Left Hip",
  },
  {
    value: "rightHip",
    label: "Right Hip",
  },
  {
    value: "leftKnee",
    label: "Left Knee",
  },
  {
    value: "rightKnee",
    label: "Right Knee",
  },
  {
    value: "leftAnkle",
    label: "Left Ankle",
  },
  {
    value: "rightAnkle",
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
                    setTrackingPoint?.(currentValue)
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
