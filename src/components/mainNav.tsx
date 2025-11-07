import SideBar from "./sideBar";
import Tray from "./tray";
import { useState } from "react";

function MainNav() {
  const [activeTray, setActiveTray] = useState<string | null>(null);
  const handleTrayToggle = (trayName: string) => {
    setActiveTray(activeTray === trayName ? null : trayName);
  };

  return (
    <>
      <SideBar
        onTrayOneToggle={() => handleTrayToggle("one")}
        onTrayTwoToggle={() => handleTrayToggle("two")}
      />
      <Tray
        name="one"
        bg="purple.400"
        position="absolute"
        left="70px"
        top="0"
        bottom="0"
        zIndex={1}
        transition="all 0.3s"
        transform={activeTray === "one" ? "translateX(0)" : "translateX(-100%)"}
        visibility={activeTray === "one" ? "visible" : "hidden"}
      />
      <Tray
        name="two"
        bg="pink.400"
        position="absolute"
        left="70px"
        top="0"
        bottom="0"
        zIndex={1}
        transition="all 0.3s"
        transform={activeTray === "two" ? "translateX(0)" : "translateX(-100%)"}
        visibility={activeTray === "two" ? "visible" : "hidden"}
      />
    </>
  );
}

export default MainNav;
// <SideBar onToggleTray={() => setIsTrayOpen(!isTrayOpen)} />
