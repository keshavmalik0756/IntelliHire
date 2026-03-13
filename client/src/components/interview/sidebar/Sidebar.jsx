import React from "react";
import SidebarHeader from "./SidebarHeader";
import AIInterviewerVideo from "./AIInterviewerVideo";
import CandidateCamera from "./CandidateCamera";
import AnalyticsPanel from "./AnalyticsPanel";

function Sidebar({
  aiVideo,
  aiVideoRef,
  isSpeaking,
  webcamRef,
  canvasRef,
  cameraReady,
  metrics,
  DEV_MODE,
  fpsRef
}) {
  return (
    <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 bg-white/70 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-emerald-100/60 flex flex-col overflow-y-auto transition-all duration-300">
      <SidebarHeader />

      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        <div className="min-w-[280px] lg:min-w-0 flex-1">
          <AIInterviewerVideo 
            aiVideo={aiVideo} 
            aiVideoRef={aiVideoRef}
            isSpeaking={isSpeaking}
          />
        </div>

        <div className="min-w-[280px] lg:min-w-0 flex-1">
          <CandidateCamera
            webcamRef={webcamRef}
            canvasRef={canvasRef}
            cameraReady={cameraReady}
            metrics={metrics}
            DEV_MODE={DEV_MODE}
            fpsRef={fpsRef}
          />
        </div>
      </div>

      <div className="flex-1">
        <AnalyticsPanel metrics={metrics} />
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);
