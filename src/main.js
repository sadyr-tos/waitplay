// src/main.js - Main Entry Point for WaitPlay Modular Application (v2.7)

import { DEFAULT_TEMPLATES, DEFAULT_GAMES, GUESSWORD_PRESETS, EMOJI_PAIRS, PRESETS, CROSSWORD_PRESETS } from './store/37_store_presets.js';
import { WaitPlayApp } from './core/app_class.js';

// Security Modules
import { pinMethods } from './security/01_security_pin.js';
import { authMethods } from './security/02_security_auth.js';
import { timer2FAMethods } from './security/03_security_2fa.js';
import { emailMethods } from './security/04_security_email.js';

// Account Modules
import { accountCoreMethods } from './accounts/05_account_core.js';
import { registrationMethods } from './accounts/06_account_registration.js';
import { billingMethods } from './accounts/07_account_billing.js';
import { branchMethods } from './accounts/08_account_branches.js';
import { migrationMethods } from './accounts/09_account_migration.js';

// Guest Modules
import { guestCoreMethods } from './guest/10_guest_core.js';
import { guestQRMethods } from './guest/11_guest_qr.js';
import { guestRunnerMethods } from './guest/12_guest_game_runner.js';
import { leaderboardMethods } from './guest/13_guest_leaderboard.js';
import { feedbackMethods } from './guest/14_guest_feedback.js';

// Admin Modules
import { adminCoreMethods } from './admin/15_admin_core.js';
import { adminCatalogMethods } from './admin/16_admin_catalog.js';
import { adminSettingsMethods } from './admin/17_admin_settings.js';
import { adminAnalyticsMethods } from './admin/18_admin_analytics.js';
import { adminQRMethods } from './admin/19_admin_qr_manager.js';
import { adminPromosMethods } from './admin/20_admin_promos.js';

// Base Games Column
import { quizMethods } from './games/base/21_game_quiz.js';
import { differencesMethods } from './games/base/22_game_differences.js';
import { tictactoeMethods } from './games/base/23_game_tictactoe.js';
import { crosswordMethods } from './games/base/24_game_crossword.js';
import { memoryMethods } from './games/base/25_game_memory.js';
import { guesswordMethods } from './games/base/26_game_guessword.js';
import { checkersMethods } from './games/base/27_game_checkers.js';

// PRO Games & Generators Column
import { stickmanMethods } from './games/pro/28_game_stickman.js';
import { subwayMethods } from './games/pro/29_game_subway.js';
import { slicingMethods } from './games/pro/30_game_slicing.js';
import { battleshipMethods } from './games/pro/31_game_battleship.js';
import { chessMethods } from './games/pro/32_game_chess.js';
import { aiGeneratorMethods } from './games/pro/33_ai_generator_core.js';
import { aiPromptsMethods } from './games/pro/34_ai_prompts.js';
import { commonEngineMethods } from './games/pro/35_game_common_engine.js';

// Store & Data
import { storeCoreMethods } from './store/36_store_core.js';
import { backupMethods } from './store/38_store_backup.js';

// UI & Utils
import { modalMethods } from './ui/39_ui_modal.js';
import { toastMethods } from './ui/40_ui_toast.js';
import { emojiPickerMethods } from './ui/41_ui_emoji_picker.js';
import { themeMethods } from './ui/42_ui_theme.js';

// Expose globals expected by preset data
window.DEFAULT_TEMPLATES = DEFAULT_TEMPLATES;
window.DEFAULT_GAMES = DEFAULT_GAMES;
window.GUESSWORD_PRESETS = GUESSWORD_PRESETS;
window.EMOJI_PAIRS = EMOJI_PAIRS;
window.PRESETS = PRESETS;
window.CROSSWORD_PRESETS = CROSSWORD_PRESETS;

// Attach all module methods onto WaitPlayApp prototype
Object.assign(WaitPlayApp.prototype,
    pinMethods,
    authMethods,
    timer2FAMethods,
    emailMethods,
    accountCoreMethods,
    registrationMethods,
    billingMethods,
    branchMethods,
    migrationMethods,
    guestCoreMethods,
    guestQRMethods,
    guestRunnerMethods,
    leaderboardMethods,
    feedbackMethods,
    adminCoreMethods,
    adminCatalogMethods,
    adminSettingsMethods,
    adminAnalyticsMethods,
    adminQRMethods,
    adminPromosMethods,
    quizMethods,
    differencesMethods,
    tictactoeMethods,
    crosswordMethods,
    memoryMethods,
    guesswordMethods,
    checkersMethods,
    stickmanMethods,
    subwayMethods,
    slicingMethods,
    battleshipMethods,
    chessMethods,
    aiGeneratorMethods,
    aiPromptsMethods,
    commonEngineMethods,
    storeCoreMethods,
    backupMethods,
    modalMethods,
    toastMethods,
    emojiPickerMethods,
    themeMethods
);

// Instantiate app and expose globally for inline HTML event handlers (e.g., onclick="app.editQuiz()")
window.app = new WaitPlayApp();

document.addEventListener('DOMContentLoaded', () => {
    if (window.app && typeof window.app.init === 'function') {
        window.app.init();
    }
});
