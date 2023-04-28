import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import useUserState from './useUserState';

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_OAUTH_CLIENT_ID = 'aa35721dd67709b79ce2';
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export default function useOAuthPopup() {
  const [user, setUser] = useUserState();
  const [oauthPopup, setOauthPopup] = useState<Window | null>(null);
  const popupInterval = useRef<number | null>(null);

  const openOAuthPopup = useCallback(() => {
    const options = `top=${window.outerHeight / 2 - POPUP_HEIGHT / 2}, left=${
      window.outerWidth / 2 - POPUP_WIDTH / 2
    }, width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, status=no, menubar=no, toolbar=no, resizable=no`;
    const popup = window.open(
      `${GITHUB_OAUTH_URL}?client_id=${GITHUB_OAUTH_CLIENT_ID}`,
      '_blank',
      options
    );
    setOauthPopup(popup);
  }, []);

  useEffect(() => {
    if (!oauthPopup) {
      return;
    }
    if (user) {
      oauthPopup?.close();
      setOauthPopup(null);
      return;
    }
    popupInterval.current = setInterval(async () => {
      const currentUrl = oauthPopup.location.href;
      const params = new URL(currentUrl).searchParams;
      const code = params.get('code');
      if (!code) {
        return;
      }
      popupInterval.current && clearInterval(popupInterval.current);
      const { data } = await axios.post(
        'http://127.0.0.1:8080/github/oauth',
        { code },
        { withCredentials: true }
      );
      setUser(data.data);
    }, 500);
    return () => {
      popupInterval.current && clearInterval(popupInterval.current);
      oauthPopup?.close();
      setOauthPopup(null);
    };
  }, [oauthPopup, user]);

  return openOAuthPopup;
}
