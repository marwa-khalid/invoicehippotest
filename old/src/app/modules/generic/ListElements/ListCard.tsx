import React from "react";

interface ListCardProps {
  children: React.ReactNode;
  cardClass?: string;
}

const ListCard: React.FC<ListCardProps> = ({
  children,
  cardClass = "card h-100 pt-6 position-relative",
}) => {
  return (
    <div className="col">
      <div className={cardClass}>{children}</div>
    </div>
  );
};

export default ListCard;
