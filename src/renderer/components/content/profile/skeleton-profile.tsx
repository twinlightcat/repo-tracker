import React from "react";
import { SkeletonPulse } from "../../common/skeleton";

export default function SkeletonProfile() {
  return (
    <span className="group block shrink-0">
      <div className="flex items-center">
        <div>
          <SkeletonPulse width="2.5rem" height="2.5rem" />
        </div>
        <div className="ml-3">
          <div className="pb-2">
            <SkeletonPulse width="12ch" height="1rem" />
          </div>
          <div className="pb-1">
            <SkeletonPulse width="5ch" height="1rem" />
          </div>
        </div>
      </div>
    </span>
  );
}
