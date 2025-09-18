import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/community-carousel.css"; 
export const NextArrow = props => (
  <CarouselArrow direction="right" {...props} />
);

export const PrevArrow = props => (
  <CarouselArrow direction="left" {...props} />
);

export const CarouselArrow = ({ direction = "left", onClick, variant = "circle" }) => {
  const isLeft = direction === "left";

  const icon =
    variant === "circle"
      ? isLeft
        ? faCircleChevronLeft
        : faCircleChevronRight
      : isLeft
        ? faChevronLeft
        : faChevronRight;

  return (
    <div
      onClick={onClick}
      className={`carousel-arrow ${isLeft ? "left" : "right"}`}
      aria-label={isLeft ? "Précédent" : "Suivant"}
      role="button"
      tabIndex={0}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};





