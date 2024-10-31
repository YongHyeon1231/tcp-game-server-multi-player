import { config } from '../../config/config.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

// data는 바이트 배열로 들어올 것이다.
// 호출되는 것은 당연히 가장 최초로 데이터를 받는 onData.js에서 호출이 됩니다.
export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.CommonPacket;
  let packet;
  try {
    packet = Packet.decode(data);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.version;
  // const payload = packet.payload;
  // const sequence = packet.sequence;

  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, '알 수 없는 핸들러 ID.');
  }

  const [namespace, typeName] = protoTypeName.split('.');
  // console.log(namespace, typeName);
  const PayloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = PayloadType.decode(packet.payload);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  const errorMessage = PayloadType.verify(payload);
  if (errorMessage) {
    throw new CustomError(
      ErrorCodes.PACKET_STRUCTURE_MISMATCH,
      `패킷 구조가 일치하지 않습니다: ${errorMessage}`,
    );
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  // 여기서 필드는 common.proto같은 곳에서 handlerId, userId 등등을 말한다.
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload };
};
