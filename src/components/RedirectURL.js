import { useEffect } from "react";

export default function RedirectURL(props) {
  const { url } = props;
  
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <h3
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Đang chuyển đến {url}
    </h3>
  );
}
