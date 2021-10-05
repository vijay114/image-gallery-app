import { Slide } from "@mui/material";
import { useScrollTrigger } from "@mui/material";

function HideOnScroll({ children, window }) {

    const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default HideOnScroll;
