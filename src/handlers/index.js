import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    // handler: ,
    protoType: 'Initial.InitialPacket',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

// 핸들러아이디로 프로토타입의 이름을 조회
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }

  return handlers[handlerId].protoType;
};
