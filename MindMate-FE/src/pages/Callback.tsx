import { useAuth } from "@/context/useAuth";
import { handleGoogleCallback } from "@/services/authService";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CallbackResponse {
  requires_linking?: boolean;
  detail?: string;
  email?: string;
  access_token?: string;
  refresh_token?: string;
}

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const {googlelogin} = useAuth()
  
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
        console.log("code",code)
      if (!code) {
        alert("Authorization failed.");
        return;
      }

      try {
        const res = await handleGoogleCallback(code);
        console.log(res)
        const data: CallbackResponse = res;
        console.log(data)
        if (data.requires_linking) {
          const confirmLink = window.confirm(
            `${data.detail ?? "This account requires linking."} Do you want to link it?`
          );

          if (confirmLink) {
            // Call the link API
            const linkRes = await fetch("/auth/link-google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                access_token: data.access_token,
              }),
            });

            const linkData: CallbackResponse = await linkRes.json();

            if (linkRes.ok && linkData.access_token && linkData.refresh_token) {
              // Save tokens and redirect
              localStorage.setItem("access_token", linkData.access_token);
              localStorage.setItem("refresh_token", linkData.refresh_token);
              console.log("success")
            //   navigate("/dashboard");
            } else {
              alert(linkData.detail || "Failed to link account.");
            }
          } else {
            alert("Google account not linked.");
            // navigate("/login");
          }
        } else if ( data.access_token && data.refresh_token) {
          // Normal flow: Save tokens and redirect
          console.log("here i am")
          
          
          googlelogin(data.access_token, data.refresh_token);
        //   navigate("/dashboard");
        } else {
          alert(data.detail || "Login failed");
        }
      } catch (err) {
        console.error("Callback error", err);
        alert("Something went wrong.");
      }
    };

    handleCallback();
  }, [navigate,googlelogin]);

  return <div>Logging you in with Google...</div>;
};

export default CallbackPage;
