import React, {createContext, useContext, useEffect, useState} from 'react';
import './notification.css'
const Sidebar = () => {
  return <div>Sidebar</div>
}

const Header = () => {
  const {notify} = useContext(NotificationContext);

  const onNavigation = (path: string) => {
    notify(`heading to ${path}`)
  }
  return (<nav>
    <ul>
      <li onClick={() => onNavigation('Home')}>Home</li>
      <li onClick={() => onNavigation('Pricing')}>Pricing</li>
      <li onClick={() => onNavigation('About')}>About</li>
    </ul>
  </nav>)
}

const Main = () => {
  const {notify} = useContext(NotificationContext);

  const handleClick = () => {
    notify('Place The Order');
  };

  return <div>
    <button onClick={handleClick}>Place My Order</button>
  </div>
}

type NotificationType = {
  messages: string[],
  notify: (message: string, level?: 'information' | 'error') => void;
}

const NotificationContext = createContext<NotificationType>({
  messages: [],
  notify: () => {}
});

const NotificationProvider = ({children}: {children: React.ReactNode}) => {
  const [messages, setMessages] = useState<string[]>([]);

  const notify = (message: string) => {
    setMessages([...messages, message]);
  }

  useEffect(() => {
    const removeLast = () => {
      setMessages([...messages.slice(0, -1)])
    }

    const timers = messages.map(() => {
      return setTimeout(() => {
        removeLast();
      }, 1000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages]);

  return (
    <NotificationContext.Provider value={{messages, notify}}>
      {children}
    </NotificationContext.Provider>
  )
}

const Notifications = () => {
  const {messages} = useContext(NotificationContext);

  return <div className="notificationContainer">
    <ol>
      {messages.map((message, index) => <li key={index}>{message}</li>)}
    </ol>
  </div>
}

const NotificationApp = () => {
  return (
    <NotificationProvider>
      <Sidebar />
      <Header />
      <Main />
      <Notifications />
    </NotificationProvider>
  )
}

export {NotificationApp}