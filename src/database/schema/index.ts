import { AuthSchema } from './auth.schema';
import { ChatRoomSchema } from './chatroom.schema';
import { MessageSchema } from './message.schema';

export const Schemas = {
  Auth: { name: 'Auth', schema: AuthSchema },
  ChatRoom: { name: 'ChatRoom', schema: ChatRoomSchema },
  Message: { name: 'Message', schema: MessageSchema },
};
