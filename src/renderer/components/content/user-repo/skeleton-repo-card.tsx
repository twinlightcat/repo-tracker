import React from "react";
import { SkeletonPulse } from "../../common/skeleton";
import Card from "../../common/card";

export default function SkeletonRepoCard() {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <div className="py-2">
            <SkeletonPulse width="32ch" height="1rem" />
          </div>
          <div className="pb-5">
            <SkeletonPulse width="32ch" height="0.5rem" />
          </div>

          <SkeletonPulse width="5ch" height="1rem" />
        </div>
        <div>
          <SkeletonPulse width="10ch" height="1.5rem" />
        </div>
      </div>
    </Card>
  );
}
