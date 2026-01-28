import ReactLoading from "react-loading";

export const LoadingPopup = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <ReactLoading type="spinningBubbles" color="#DC143C" height={90} width={90} />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  popup: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    padding: "2rem",
    // borderRadius: "12px",
    textAlign: "center",
    // boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
};

