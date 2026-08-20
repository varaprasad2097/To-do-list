const StatsCard = ({ title, value, description, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div>
          <p className="stats-title">{title}</p>
          <h3>{value}</h3>
        </div>

        {icon && (
          <div className="stats-icon">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="stats-description">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatsCard;