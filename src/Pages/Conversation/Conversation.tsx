import { useParams } from "react-router-dom";



const Conversation = () => {
const { conversationId } = useParams();
return (
    <div>
        {conversationId}
    </div>
)
};

export default Conversation;