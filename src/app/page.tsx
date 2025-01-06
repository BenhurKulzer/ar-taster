"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import TrackingComponent from "@/components/Tracking";
import { TrackingSelector } from "@/components/TrackingSelector";

export default function LoginPage() {
  const [selectedPointer, setSelectedPointer] = useState("");
  const [isCamera, setIsCamera] = useState(false);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Lets try it</h1>
                  <p className="text-balance text-muted-foreground">
                    Start selecting a point to track
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Tracking Point</Label>

                  <TrackingSelector title="Select a tracking point" item="a body part" setTrackingPoint={setSelectedPointer} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Placing Item (Soon)</Label>

                  <TrackingSelector disabled title="Select an Item to place" item="Item" />
                </div>

                <Button type="button" className="w-full" onClick={() => setIsCamera(!isCamera)}>
                  {isCamera ? "Stop camera" : "Start camera"}
                </Button>
              </div>

              <TrackingComponent camera={isCamera} pointer={selectedPointer} />
            </CardContent>
          </Card>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
