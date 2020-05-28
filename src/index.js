import {
  sum_array,
  getMousePos,
  factorial,
  randint,
  animated_grid
} from "./picross_functions";

import {
  mouse_object,
  game_object,
  sprite,
  button,
  starfield,
  spark,
  timer,
  hp_tracker,
  animated_hint,
  game_board
} from "./picross_functions";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

// ******************************
// Production setup variables (will be used for reals)
// ******************************

var screen_size = [1600, 900];
canvas.width = screen_size[0];
canvas.height = screen_size[1];

var lastFrameTimeMs = 0;
var maxFPS = 60;
var frame_count = 0;

// Disable rightclick on the canvas.
// Revisit this, right click should only be suppressed in the canvac window.
canvas.oncontextmenu = function() {
  return false;
};

// Event handling (i.e. for player input)

// mouse1 and mouse2 are 0/1 for up/down respectively.
// I'm adding 'event' to the variable names to indicate that these are from the event handler.
// the 'frame' version of these same variables are to be used in the game loop.
var mouse_state = new mouse_object();
var mouse1_event = 0;
var mouse2_event = 0;
var mouse_pos_event = [0, 0];

// var hold_on = 0; //This is what type of tile we're doing a click-hold on.  -1 = crossed cell, 1 = filled cell.
// var hold_on_last_frame = 0;
var click_at = [0, 0];

// ******************************
// Production graphics loading.  This should be in a funciton in a separate file.
// ******************************

var eye_catch_bg = new Image();
eye_catch_bg.src = "src/graphics/eye_catch_bg.png";
var eye_catch_sprite = new sprite(
  eye_catch_bg,
  0,
  0,
  screen_size[0],
  screen_size[1]
);

var main_menu_bg = new Image();
main_menu_bg.src = "src/graphics/main_menu_bg.png";
var main_menu_sprite = new sprite(
  main_menu_bg,
  0,
  0,
  screen_size[0],
  screen_size[1]
);

var main_menu_buttons_sheet = new Image();
main_menu_buttons_sheet.src = "src/graphics/main_menu_buttons.png";
var main_menu_buttons_sprites = {
  sp_up: new sprite(main_menu_buttons_sheet, 0, 0, 480, 80),
  sp_dn: new sprite(main_menu_buttons_sheet, 0, 80, 480, 80),
  mp_up: new sprite(main_menu_buttons_sheet, 0, 160, 480, 80),
  mp_dn: new sprite(main_menu_buttons_sheet, 0, 240, 480, 80),
  op_up: new sprite(main_menu_buttons_sheet, 0, 320, 160, 80),
  op_dn: new sprite(main_menu_buttons_sheet, 160, 320, 160, 80)
};

// Remember, the sprite sheets for tiles is passed into our board setup function,
// and the sprite objects are created there.
var tiles_sheet = new Image();
tiles_sheet.src = "src/graphics/board_sprites.png";

// Remember, the sprite sheet for numbers is passed into our board setup function,
// and the sprite objects are created there.
var numbers_sheet = new Image();
numbers_sheet.src = "src/graphics/numbers.png";

var board_grid_sheet = new Image();
board_grid_sheet.src = "src/graphics/board_grid.png";

var board_countdown_sheet = new Image();
board_countdown_sheet.src = "src/graphics/board_countdown.png";

var single_player_buttons_sheet = new Image();
single_player_buttons_sheet.src = "src/graphics/single_player_buttons.png";
var single_player_buttons_sprites = {
  new_board_up: new sprite(single_player_buttons_sheet, 0, 0, 256, 256),
  new_board_dn: new sprite(single_player_buttons_sheet, 256, 0, 256, 256),
  pause_up: new sprite(single_player_buttons_sheet, 0, 256, 128, 128),
  pause_dn: new sprite(single_player_buttons_sheet, 128, 256, 128, 128)
};

var timer_sheet = new Image();
timer_sheet.src = "src/graphics/timer.png";
var timer_sprites = [
  new sprite(timer_sheet, 0, 0, 68, 112),
  new sprite(timer_sheet, 68, 0, 68, 112),
  new sprite(timer_sheet, 136, 0, 68, 112),
  new sprite(timer_sheet, 204, 0, 68, 112),
  new sprite(timer_sheet, 272, 0, 68, 112),
  new sprite(timer_sheet, 340, 0, 68, 112),
  new sprite(timer_sheet, 408, 0, 68, 112),
  new sprite(timer_sheet, 476, 0, 68, 112),
  new sprite(timer_sheet, 544, 0, 68, 112),
  new sprite(timer_sheet, 612, 0, 68, 112),
  new sprite(timer_sheet, 680, 0, 68, 112),
  new sprite(timer_sheet, 748, 0, 16, 112),
  new sprite(timer_sheet, 764, 0, 16, 112)
];

var hp_sheet = new Image();
hp_sheet.src = "src/graphics/hitpoints.png";
var hp_sprites = {
  hp_bg: new sprite(hp_sheet, 0, 0, 512, 384),
  hp_pip: new sprite(hp_sheet, 512, 0, 156, 236)
};

// Game state biz.
var main_game_object = new game_object();
// Main menu init stuff.
var main_menu_single_player_button_pos = [560, 380];
var main_menu_multi_player_host_button_pos = [560, 500];
var main_menu_multi_player_join_button_pos = [560, 740];
var main_menu_options_button_pos = [880, 620];
var main_menu_button_single_player_last_frame = 0;
var main_menu_button_multi_player_last_frame = 0;
var main_menu_button_options_last_frame = 0;
var main_menu_buttons = {
  single_player: new button(
    main_menu_buttons_sprites.sp_up,
    main_menu_buttons_sprites.sp_dn,
    main_menu_single_player_button_pos[0],
    main_menu_single_player_button_pos[1],
    main_menu_buttons_sprites.sp_up.width,
    main_menu_buttons_sprites.sp_up.height
  ),
  multi_player_host: new button(
    main_menu_buttons_sprites.mp_up,
    main_menu_buttons_sprites.mp_dn,
    main_menu_multi_player_host_button_pos[0],
    main_menu_multi_player_host_button_pos[1],
    main_menu_buttons_sprites.mp_up.width,
    main_menu_buttons_sprites.mp_up.height
  ),
  multi_player_join: new button(
    main_menu_buttons_sprites.mp_up,
    main_menu_buttons_sprites.mp_dn,
    main_menu_multi_player_join_button_pos[0],
    main_menu_multi_player_join_button_pos[1],
    main_menu_buttons_sprites.mp_up.width,
    main_menu_buttons_sprites.mp_up.height
  ),
  options: new button(
    main_menu_buttons_sprites.op_up,
    main_menu_buttons_sprites.op_dn,
    main_menu_options_button_pos[0],
    main_menu_options_button_pos[1],
    main_menu_buttons_sprites.op_up.width,
    main_menu_buttons_sprites.op_up.height
  )
};
// single player init stuff.
var sp_stars = new starfield(screen_size);
var current_sp_board;
var current_sp_hp_tracker;
var single_player_new_board_button_pos = [40, 150];
var single_player_pause_button_pos = [40, 500];
var single_player_buttons = {
  new_board: new button(
    single_player_buttons_sprites.new_board_up,
    single_player_buttons_sprites.new_board_dn,
    single_player_new_board_button_pos[0],
    single_player_new_board_button_pos[1],
    single_player_buttons_sprites.new_board_up.width,
    single_player_buttons_sprites.new_board_up.height
  ),
  pause_button: new button(
    single_player_buttons_sprites.pause_up,
    single_player_buttons_sprites.pause_dn,
    single_player_pause_button_pos[0],
    single_player_pause_button_pos[1],
    single_player_buttons_sprites.pause_up.width,
    single_player_buttons_sprites.pause_up.height
  )
};

var single_player_pause_buttons_main_menu_pos = [300, 340];
var single_player_pause_buttons_etc_pos = [300, 436];
var single_player_pause_buttons_unpause = [748, 532];
var single_player_pause_buttons_sheet = new Image();
single_player_pause_buttons_sheet.src =
  "src/graphics/single_player_pause_buttons.png";
var single_player_pause_buttons_sprites = {
  return_to_main_menu_up: new sprite(
    single_player_pause_buttons_sheet,
    0,
    0,
    512,
    64
  ),
  return_to_main_menu_dn: new sprite(
    single_player_pause_buttons_sheet,
    0,
    64,
    512,
    64
  ),
  etc_up: new sprite(single_player_pause_buttons_sheet, 0, 128, 512, 64),
  etc_dn: new sprite(single_player_pause_buttons_sheet, 0, 192, 512, 64),
  unpause_up: new sprite(single_player_pause_buttons_sheet, 0, 256, 64, 64),
  unpause_dn: new sprite(single_player_pause_buttons_sheet, 64, 256, 64, 64)
};

var single_player_pause_buttons = {
  return_to_main_menu: new button(
    single_player_pause_buttons_sprites.return_to_main_menu_up,
    single_player_pause_buttons_sprites.return_to_main_menu_dn,
    single_player_pause_buttons_main_menu_pos[0],
    single_player_pause_buttons_main_menu_pos[1],
    single_player_pause_buttons_sprites.return_to_main_menu_up.width,
    single_player_pause_buttons_sprites.return_to_main_menu_up.height
  ),
  etc: new button(
    single_player_pause_buttons_sprites.etc_up,
    single_player_pause_buttons_sprites.etc_dn,
    single_player_pause_buttons_etc_pos[0],
    single_player_pause_buttons_etc_pos[1],
    single_player_pause_buttons_sprites.etc_up.width,
    single_player_pause_buttons_sprites.etc_up.height
  ),
  unpause: new button(
    single_player_pause_buttons_sprites.unpause_up,
    single_player_pause_buttons_sprites.unpause_dn,
    single_player_pause_buttons_unpause[0],
    single_player_pause_buttons_unpause[1],
    single_player_pause_buttons_sprites.unpause_up.width,
    single_player_pause_buttons_sprites.unpause_up.height
  )
};

var current_sp_timer;

// Input setup
canvas.addEventListener("mousedown", function(e) {
  if (e.button == 0) {
    mouse1_event = 1;
  }
  if (e.button == 1) {
    console.log("You middle clicked (?)");
  }
  if (e.button == 2) {
    mouse2_event = 1;
  }
});

canvas.addEventListener("mouseup", function(e) {
  if (e.button == 0) {
    mouse1_event = 0;
  }
  if (e.button == 1) {
    console.log("You un-middle clicked (?)");
  }
  if (e.button == 2) {
    mouse2_event = 0;
  }
});

canvas.addEventListener("mousemove", function(e) {
  mouse_pos_event = getMousePos(canvas, e);
});

// ******************************
// Test setup variables (Put any 'ol shit here)
// ******************************
var x = 0;
var y = 0;
var z = 0;
var done = false;
var downloaded_solution = {};

// ******************************
// Our good friend, the main game loop.
// ******************************
function main_loop(timestamp) {
  /* Throttle Framerate.  This causes the loop to reset without doing anything if
  we get to this frame too early. */
  if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
    requestAnimationFrame(main_loop);
    return;
  }

  var delta = timestamp - lastFrameTimeMs;
  var deltaNormal = delta / maxFPS;
  lastFrameTimeMs = timestamp;
  frame_count++;

  // ******************************
  // Production fame update code.
  // ******************************

  mouse_state.update_state(mouse1_event, mouse2_event, mouse_pos_event);

  // Game State Handling.

  if (main_game_object.current_state == "eye_catch") {
    if (mouse_state.mouse1_click_start || mouse_state.mouse2_click_start) {
      main_game_object.set_state("main_menu");
      mouse_state.mouse1_click_start = 0;
      mouse_state.mouse2_click_start = 0;
    }
  }

  if (main_game_object.current_state == "main_menu") {
    main_menu_buttons.single_player.update(mouse_state);
    main_menu_buttons.multi_player_host.update(mouse_state);
    main_menu_buttons.multi_player_join.update(mouse_state);
    main_menu_buttons.options.update(mouse_state);

    if (main_menu_buttons.single_player.clicked) {
      main_game_object.set_state("single_player");
      mouse_state.mouse1_click_start = 0;
      mouse_state.mouse2_click_start = 0;
      main_menu_buttons.single_player.clicked = false;
      main_game_object.network_mode = "offline";
    }

    if (main_menu_buttons.multi_player_host.clicked) {
      main_game_object.set_state("single_player");
      mouse_state.mouse1_click_start = 0;
      mouse_state.mouse2_click_start = 0;
      main_menu_buttons.multi_player_host.clicked = false;
      main_game_object.network_mode = "host";
    }

    if (main_menu_buttons.multi_player_join.clicked) {
      main_game_object.set_state("joining");
      mouse_state.mouse1_click_start = 0;
      mouse_state.mouse2_click_start = 0;
      main_menu_buttons.multi_player_join.clicked = false;
      main_game_object.network_mode = "join";
    }
  }

  if (main_game_object.current_state == "joining") {
    console.log("Let's join!");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //copy the board from the server
        console.log(this.response);
        var packet = JSON.parse(this.response);
        downloaded_solution = packet.solution;
        main_game_object.set_state("single_player");
      }
    };
    xhttp.open(
      "POST",
      "https://www.superjer.com/turbocross/api.php?network_mode=join",
      true
    );
    xhttp.send("{}");
    main_game_object.set_state("waiting");
  }

  if (main_game_object.current_state == "waiting") {
    console.log("Waiting...");
  }

  if (main_game_object.current_state == "single_player") {
    if (main_game_object.need_board) {
      single_player_buttons.new_board.clicked = false;
      current_sp_board = new game_board();
      // fixme: avoid generating a solution in join mode
      current_sp_board.setup_board(
        main_game_object.sp_board_size,
        main_game_object.sp_board_size,
        main_game_object.sp_board_location,
        tiles_sheet,
        numbers_sheet,
        board_grid_sheet,
        board_countdown_sheet
      );

      if (main_game_object.network_mode == "host") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //here's where to respond to an error
            var resp = JSON.parse(this.response);
            console.log(resp.status); // example check if == success?
          }
        };
        xhttp.open(
          "POST",
          "https://www.superjer.com/turbocross/api.php?network_mode=host",
          true
        );
        var packet = {
          solution: current_sp_board.solution
        };
        xhttp.send(JSON.stringify(packet));
      } else if (main_game_object.network_mode == "join") {
        //board already loaded during "waiting" state
        current_sp_board.solution = downloaded_solution;
        current_sp_board.update_hints();
      }

      // current_sp_board.position = main_game_object.sp_board_location;
      current_sp_hp_tracker = new hp_tracker();
      current_sp_hp_tracker.position = main_game_object.sp_hp_location;
      // main_game_object.player_hp = 4;
      current_sp_timer = new timer();
      current_sp_timer.position = main_game_object.sp_timer_location;
      main_game_object.need_board = false;
      console.log(current_sp_board);
    }

    if (!current_sp_board.complete && current_sp_hp_tracker.player_hp > 0) {
      if (mouse_state.mouse1_click_hold == 1) {
        current_sp_board.click_left(
          mouse_state.mouse_pos_frame,
          mouse_state,
          current_sp_hp_tracker
        );
      }

      if (mouse_state.mouse2_click_hold == 1) {
        current_sp_board.click_right(mouse_state.mouse_pos_frame, mouse_state);
      }
    }

    if (current_sp_hp_tracker.player_hp == 0) {
      current_sp_board.failed = true;
    }

    if (mouse_state.mouse1_click_end == 1) {
      current_sp_board.is_complete();
    }

    current_sp_hp_tracker.update();

    current_sp_board.update(delta, mouse_state);
    if (
      !current_sp_board.complete &&
      current_sp_hp_tracker.player_hp > 0 &&
      current_sp_board.intro_state == 0
    ) {
      current_sp_timer.active = true;
      current_sp_timer.update(delta);
    }

    if (current_sp_board.complete || current_sp_hp_tracker.player_hp == 0) {
      current_sp_hp_tracker.complete = true;
      current_sp_board.failed = true;
      single_player_buttons.new_board.update(mouse_state);
    }

    single_player_buttons.pause_button.update(mouse_state);

    if (single_player_buttons.new_board.clicked) {
      main_game_object.need_board = true;
      single_player_buttons.new_board.clicked = false;
    }

    if (single_player_buttons.pause_button.clicked) {
      main_game_object.set_state("single_player_pause");
      single_player_buttons.pause_button.clicked = false;
    }
  }

  if (main_game_object.current_state == "single_player_pause") {
    single_player_pause_buttons.return_to_main_menu.update(mouse_state);
    single_player_pause_buttons.etc.update(mouse_state);
    single_player_pause_buttons.unpause.update(mouse_state);

    if (single_player_pause_buttons.return_to_main_menu.clicked) {
      main_game_object.set_state("main_menu");
      main_game_object.need_board = true;
      single_player_pause_buttons.return_to_main_menu.clicked = false;
    }

    if (single_player_pause_buttons.unpause.clicked) {
      main_game_object.set_state("single_player");
      single_player_pause_buttons.unpause.clicked = false;
    }
  }

  // ******************************
  // Test frame update code, anything goes.
  // ******************************

  // *******************
  // Production render code
  // *******************

  // Clear screen every frame.
  ctx.clearRect(0, 0, screen_size[0], screen_size[1]);

  if (main_game_object.current_state == "eye_catch") {
    eye_catch_sprite.draw(ctx, 0, 0);
  }

  if (main_game_object.current_state == "main_menu") {
    main_menu_sprite.draw(ctx, 0, 0);
    main_menu_buttons.single_player.draw(ctx);
    main_menu_buttons.multi_player_host.draw(ctx);
    main_menu_buttons.multi_player_join.draw(ctx);
    main_menu_buttons.options.draw(ctx);
  }

  if (main_game_object.current_state == "single_player") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screen_size[0], screen_size[1]);
    sp_stars.update_stars(ctx);
    current_sp_board.draw_board(ctx);

    current_sp_hp_tracker.draw(ctx, hp_sprites.hp_bg, hp_sprites.hp_pip);

    current_sp_timer.draw(ctx, timer_sprites);
    if (current_sp_board.complete || current_sp_hp_tracker.player_hp == 0) {
      single_player_buttons.new_board.draw(ctx);
    }
    single_player_buttons.pause_button.draw(ctx);
  }

  if (main_game_object.current_state == "single_player_pause") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screen_size[0], screen_size[1]);
    sp_stars.update_stars(ctx);

    current_sp_hp_tracker.draw(ctx, hp_sprites.hp_bg, hp_sprites.hp_pip);

    current_sp_timer.draw(ctx, timer_sprites);

    single_player_pause_buttons.return_to_main_menu.draw(ctx);
    single_player_pause_buttons.etc.draw(ctx);
    single_player_pause_buttons.unpause.draw(ctx);
  }

  // *********************************
  // Test render code
  // *********************************

  // if (spark_exists) {
  //   for (x = 0; x < 10; x++) {
  //     spark_array[x].draw(ctx);
  //   }
  // }

  requestAnimationFrame(main_loop);
}

requestAnimationFrame(main_loop);
