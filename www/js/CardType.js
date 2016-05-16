function CardType() {

}//end CardType

CardType.IDENTITY = "IDENTITY";
CardType.ECONOMY = "ECONOMY";
CardType.PREVENT = "PREVENT";
CardType.EVENT = "EVENT";
CardType.PROGRAM = "PROGRAM";
CardType.ICE_BREAKER = "ICE_BREAKER";
CardType.FRACTER = "FRACTER";
CardType.DECODER = "DECODER";
CardType.KILLER = "KILLER";
CardType.AI = "AI";
CardType.HARDWARE = "HARDWARE";
CardType.RESOURCE = "RESOURCE";
CardType.AGENDA = "AGENDA";
CardType.ICE = "ICE";
CardType.BARRIER = "BARRIER";
CardType.CODE_GATE = "CODE_GATE";
CardType.SENTRY = "SENTRY";
CardType.TRAP = "TRAP";
CardType.MYTHIC = "MYTHIC";
CardType.OPERATION = "OPERATION";
CardType.ASSET = "ASSET";
CardType.UPGRADE = "UPGRADE";
CardType.FIXED = "FIXED";
CardType.COMMON = "COMMON";
CardType.UNCO = "UNCO";
CardType.RARE = "RARE";
CardType.BANNED = "BANNED";

function CardTypes() {

}//end CardTypes

CardTypes[Side.CORP] = [CardType.AGENDA, CardType.ASSET, CardType.UPGRADE, CardType.OPERATION, CardType.ICE];
CardTypes[Side.RUNNER] = [CardType.EVENT, CardType.HARDWARE, CardType.RESOURCE, CardType.PROGRAM];