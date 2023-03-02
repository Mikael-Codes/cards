import { PanInfo, motion } from "framer-motion";
import { useState } from "react";
import { CardProps } from "types";

const Card: React.FC<CardProps> = ({ card, removeCard, active }) => {
  const [leaveX, setLeaveX] = useState(0);
  const [leaveY, setLeaveY] = useState(0);
  const onDragEnd = (_e: any, info: PanInfo) => {
    if (info.offset.y < -100) {
      setLeaveY(-2000);
      removeCard(card, "like"); // All likes for now
      return;
    }
    if (info.offset.x > 100) {
      setLeaveX(1000);
      removeCard(card, "like");
    }
    if (info.offset.x < -100) {
      setLeaveX(-1000);
      removeCard(card, "like");
    }
  };
  const classNames = `absolute h-[480px] w-[300px] card-bg shadow-xl rounded-2xl flex flex-col justify-center items-center cursor-grab card-holder`;
  return (
    <>
      {active ? (
        <motion.div
          
          drag={true}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={onDragEnd}
          initial={{
            scale: 1,
          }}
          animate={{
            scale: 1.05,
            rotate: `${card.text2.length % 2 === 0 ? 4 : -4}deg`,
          }}
          exit={{
            x: leaveX,
            y: leaveY,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 },
          }}
          className={classNames}
          data-testid="active-card"
        >
          <img className='card-img' src ={card.image} />
          {/* <Title title={card.name} color={card.color} /> */}
          <p className='card-text' style={{textAlign: 'left' }}>{card.text1}</p>
          <p className='card-text' style={{textAlign: 'left', fontStyle:"italic" }}>{card.text2}</p>

        </motion.div>
      ) : (
        <div
          className={`${classNames} ${
            card.name.length % 2 === 0 ? "rotate-6" : "-rotate-6"
          }`}
        >
          <img className='card-img' src ={card.image} />
          {/* <Title title={card.name} color={card.color} /> */}
          <p className='card-text' style={{textAlign: 'left' }}>{card.text1}</p>
          <p className='card-text'>{card.text2}</p>
        </div>
      )}
    </>
  );
};

/**
 * a11y friendly component for emojis
 * @reference https://devyarns.com/accessible-emojis
 */
const Emoji: React.FC<{ emoji: string; label: string }> = ({
  emoji,
  label,
}) => {
  return (
    <span role="img" aria-label={label} className="text-[140px]">
      {emoji}
    </span>
  );
};

const Title: React.FC<{ title: string; color: string }> = ({
  title,
  color,
}) => {
  return (
    <span style={{ color }} className="text-5xl font-bold">
      {title}
    </span>
  );
};

export default Card;
