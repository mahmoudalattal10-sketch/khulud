"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
// Standard routes
router.put('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, roomController_1.RoomController.updateRoom);
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, roomController_1.RoomController.deleteRoom);
exports.default = router;
