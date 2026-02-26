import { useState } from "react";

const StarRating = ({
  rating = 0,
  maxStars = 5,
  interactive = false,
  onChange,
  size = "1.2rem",
  blue = false,
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="stars" style={{ fontSize: size }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (interactive ? hover || rating : rating);

        return (
          <span
            key={i}
            className={`star ${isFilled ? (blue ? "blue-filled" : "filled") : ""}`}
            style={{
              cursor: interactive ? "pointer" : "default",
              transition: "all 0.2s",
              transform: interactive && starValue <= hover ? "scale(1.2)" : "scale(1)",
            }}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
