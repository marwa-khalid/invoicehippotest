const ListLoading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <img
        src="/ih_animation.gif" // Path to your GIF
        alt="Loading animation"
        style={{
          width: "250px",
          height: "auto",
          maxWidth: "25%",
          borderBottom: 0,
        }}
        className="loading-animation justify-content-center text-center align-items-center"
      />
    </div>
  );
};

export { ListLoading };
