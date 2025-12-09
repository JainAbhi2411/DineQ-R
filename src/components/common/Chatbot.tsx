import { useLocation } from 'react-router-dom';
import OrderChatBot from '@/components/customer/OrderChatBot';

export default function Chatbot() {
  const location = useLocation();
  
  // Only show the chatbot on menu browsing pages
  const isMenuPage = location.pathname.includes('/menu/');
  
  if (!isMenuPage) {
    return null;
  }

  // The OrderChatBot will be rendered by MenuBrowsing page itself
  // This component is just a placeholder to prevent duplicate rendering
  return null;
}
