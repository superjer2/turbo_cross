export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [evt.clientX - rect.left, evt.clientY - rect.top];
}

export function sum_array(array) {
  var x = 0;
  var total = 0;
  for (x = 0; x < array.length; x++) {
    total += array[x];
  }
  return total;
}

export function shuffle(array) {
  var copy = [];
  var n = array.length;
  var i;

  // While there remain elements to shuffle…
  while (n) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}

export function factorial(number) {
  if (!Number.isInteger(number)) {
    console.log("Passed a non integer to factorial function :(");
    return NaN;
  }
  if (number == 0) {
    console.log("Passed 0 to the factorial function, returning 1.  Was this on purpose?");
  }
  if (number < 0) {
    console.log("Passed a negative number to factorial function :(");
    return NaN;
  }

  if (number > 1) {
    return number * factorial(number - 1);
  } else {
    return 1;
  }
}

export function randint(min, max) {
  var range = max - min + 1;
  var rando = Math.random();
  rando *= range;
  rando += min;
  rando = Math.floor(rando);
  return rando;
}

export class mouse_object {
  constructor() {
    this.mouse1_last_frame = 0;
    this.mouse1_this_frame = 0;
    this.mouse2_last_frame = 0;
    this.mouse2_this_frame = 0;
    this.mouse_pos = 0;

    this.mouse1_click_start = 0;
    this.mouse1_click_hold = 0;
    this.mouse1_click_end = 0;
    this.mouse2_click_start = 0;
    this.mouse2_click_hold = 0;
    this.mouse2_click_end = 0;
  }

  update_state(mouse1_event, mouse2_event, mouse_pos_event) {
    this.mouse1_last_frame = this.mouse1_this_frame;
    this.mouse1_this_frame = mouse1_event;
    this.mouse2_last_frame = this.mouse2_this_frame;
    this.mouse2_this_frame = mouse2_event;
    this.mouse_pos_frame = mouse_pos_event;

    if (this.mouse1_last_frame == 0 && this.mouse1_this_frame == 1) {
      this.mouse1_click_start = 1;
      this.mouse2_click_hold = 0;
    } else {
      this.mouse1_click_start = 0;
    }

    if (this.mouse1_last_frame == 1 && this.mouse1_this_frame == 0) {
      this.mouse1_click_end = 1;
    } else {
      this.mouse1_click_end = 0;
    }

    if (this.mouse2_last_frame == 0 && this.mouse2_this_frame == 1) {
      this.mouse2_click_start = 1;
      this.mouse1_click_hold = 0;
    } else {
      this.mouse2_click_start = 0;
    }

    if (this.mouse2_last_frame == 1 && this.mouse2_this_frame == 0) {
      this.mouse2_click_end = 1;
    } else {
      this.mouse2_click_end = 0;
    }

    // Detect when we're holding the mouse
    if (this.mouse1_click_start == 1 && this.mouse1_click_end != 1) {
      this.mouse1_click_hold = 1;
    } else if (this.mouse1_click_hold == 1 && this.mouse1_click_end != 1) {
      this.mouse1_click_hold = 1;
    } else {
      this.mouse1_click_hold = 0;
    }

    if (this.mouse2_click_start == 1 && this.mouse2_click_end != 1) {
      this.mouse2_click_hold = 1;
    } else if (this.mouse2_click_hold == 1 && this.mouse2_click_end != 1) {
      this.mouse2_click_hold = 1;
    } else {
      this.mouse2_click_hold = 0;
    }
  }
}

export class game_object {
  constructor() {
    this.current_state = "eye_catch";
    // Available states (WIP):
    // eye_catch
    // main_menu
    // options
    // single_player
    // single_player_pause
    // MP lobby
    // MP gameplay
    // MP postgame
    this.network_mode = 'offline';
    this.sp_board_size = 15;
    this.need_board = true;
    this.player_hp = 4;

    // UI settings:
    this.sp_board_location = [300, 40];
    this.sp_hp_location = [1000, 300];
    this.sp_timer_location = [1000, 700];

    // Put options here as member variables of the game object.  SFX on/off etc.
  }

  set_state(state) {
    if (state == "main_menu") {
      this.current_state = "main_menu";
    } else if (state == "single_player") {
      this.current_state = "single_player";
    } else if (state == "single_player_pause") {
      this.current_state = "single_player_pause";
    } else if (state == "joining") {
      this.current_state = "joining";
    } else if (state == "waiting") {
      this.current_state = "waiting";
    }
  }
}

export class sprite {
  constructor(i, x, y, w, h) {
    this.sheet = i;
    this.x_pos = [x]; // This is the position on the sprite sheet, not in game space.
    this.y_pos = [y]; // This is the position on the sprite sheet, not in game space.
    this.width = [w];
    this.height = [h];
    this.current_frame = 0;
    this.animated = false;
    this.looping = false; // Whether the animation loops.
    this.age = 0; // Number of frames this sprite has existed for finding which frame we should be on.
    this.num_frames = 1;
    this.frame_period = 1; // Game frames to hold on a particular animation frame.
    this.frame_hold = this.frame_period - 1; // This is for waiting to update age, used in conjunction with frame_period.
  }

  // This function adds a new frame of animation at [x, y] on the sprite sheet, and increments the frame count.
  //
  add_frame(x, y, w = this.width[0], h = this.height[0]) {
    this.x_pos.push(x);
    this.y_pos.push(y);
    this.width.push(w);
    this.height.push(h);
    this.num_frames++;
  }

  update() {
    if (this.animated && this.looping) {
      if (this.frame_hold == 0) {
        this.frame_hold = this.frame_period;
        this.current_frame++;
      } else {
        this.frame_hold--;
      }
      if (this.current_frame > this.num_frames - 1) {
        this.current_frame == 0;
      }
    } else if (this.animated && !this.looping) {
      if (this.frame_hold == 0) {
        this.frame_hold = this.frame_period;
        this.current_frame++;
      } else {
        this.frame_hold--;
      }
      if (this.current_frame > this.num_frames - 1) {
        this.current_frame = this.num_frames - 1;
      }
    }
    this.age++;
  }

  draw(context, x, y) {
    context.drawImage(
      this.sheet,
      this.x_pos[this.current_frame],
      this.y_pos[this.current_frame],
      this.width[this.current_frame],
      this.height[this.current_frame],
      x,
      y,
      this.width[this.current_frame],
      this.height[this.current_frame]
    );
  }
}

export class button {
  constructor(s_up, s_down, x, y, w, h) {
    // s_up and s_down are sprite objects, i.e. what to render in those states.
    this.sprite_up = s_up;
    this.sprite_dn = s_down;
    this.x_pos = x;
    this.y_pos = y;
    this.width = w[0];
    this.height = h[0];
    this.state = false; // The button's visual state is false/true when up/down.
    this.clicked = false; // Whether the button has been clicked for logic.
    this.grabbed = false;
  }

  update(mouse_object) {
    // mouse_state
    if (this.mouse_hover(mouse_object) && mouse_object.mouse1_click_start) {
      this.grabbed = true;
    }

    if (this.mouse_hover(mouse_object) && this.grabbed && mouse_object.mouse1_click_end) {
      this.clicked = true;
    }

    if (mouse_object.mouse1_click_end == 1) {
      this.grabbed = false;
    }

    if (mouse_object.mouse2_click_start == 1) {
      this.grabbed = false;
    }

    if (this.mouse_hover(mouse_object) && this.grabbed) {
      this.state = true;
    } else {
      this.state = false;
    }
  }

  draw(context) {
    if (this.state) {
      this.sprite_dn.draw(context, this.x_pos, this.y_pos);
    } else {
      this.sprite_up.draw(context, this.x_pos, this.y_pos);
    }
  }

  mouse_hover(mouse_object) {
    if (
      mouse_object.mouse_pos_frame[0] > this.x_pos &&
      mouse_object.mouse_pos_frame[0] < this.x_pos + this.width &&
      mouse_object.mouse_pos_frame[1] > this.y_pos &&
      mouse_object.mouse_pos_frame[1] < this.y_pos + this.height
    ) {
      return true;
    }
    return false;
  }
}

export class starfield {
  constructor(screen_size) {
    var x;
    this.star_list = [];
    this.screen_size = screen_size;
    this.starcount = 1000;
    for (x = 0; x < this.starcount; x++) {
      this.star_list.push([randint(0, screen_size[0] - 1), randint(0, screen_size[1] - 1)]);
    }
    this.screensize = screen_size;
  }

  update_stars(context) {
    var rando_element = randint(0, this.star_list.length - 1);
    var rando_direction = randint(0, 3); // 0-3 == north/east/south/west
    if (rando_direction == 0) {
      this.star_list[rando_element][1]--;
      if (this.star_list[rando_element][1] < 0) {
        this.star_list[rando_element][1] = this.screen_size[1];
      }
    } else if (rando_direction == 1) {
      this.star_list[rando_element][0]++;
      if (this.star_list[rando_element][0] > this.screen_size[0]) {
        this.star_list[rando_element][0] = 0;
      }
    } else if (rando_direction == 2) {
      this.star_list[rando_element][1]++;
      if (this.star_list[rando_element][1] > this.screen_size[1]) {
        this.star_list[rando_element][1] = 0;
      }
    } else {
      this.star_list[rando_element][0]--;
      if (this.star_list[rando_element][0] < 0) {
        this.star_list[rando_element][0] = this.screen_size[0];
      }
    }

    // Render stars
    var rando_color;
    var x;

    for (x = 0; x < this.star_list.length; x++) {
      rando_color = randint(1, 100);
      if (rando_color >= 99) {
        rando_color = "#ff0000";
      } else if (rando_color >= 97) {
        rando_color = "#00ff00";
      } else if (rando_color >= 95) {
        rando_color = "#0000ff";
      } else if (rando_color >= 20) {
        rando_color = "#ffffff";
      } else if (rando_color >= 10) {
        rando_color = "#dddddd";
      } else {
        rando_color = "#888888";
      }
      context.fillStyle = rando_color;
      context.fillRect(this.star_list[x][0], this.star_list[x][1], 1, 1);
    }
  }
}

export class spark {
  constructor(x_pos, y_pos, direction) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.velocity = randint(5, 15);
    this.wiggle_pos = 0;
    //direction should be 0/1/2/3 for north/east/south/west.
    this.direction = direction;
    this.age = 0;
    this.size = 2;
    this.color = "#ff8000";
    this.red_start = 255;
    this.red = this.red_start;
    this.red_string = this.red.toString(16);
    this.green_start = 128;
    this.green = this.green_start;
    this.green_string = this.green.toString(16);
    this.blue_start = 0;
    this.blue = this.blue_start;
    this.blue_string = this.blue.toString(16);
    this.wiggle_period = randint(5, 15); // # of frames to wiggle once. mske random later
    this.wiggle_amplitude = randint(10, 30); // In pixels.  Make random later
    this.wiggle_offset = Math.random() * 2 * Math.PI; // Angular offset for sin wiggle [0 - 2PI)
    this.max_age = randint(30, 90); // Lifetime in frames.  Make this random later.
    this.wiggle_switch = 1;
    this.wiggle_switch_probability = 10; // Chance out of 100 for a spark to switch each frame;
  }

  update() {
    if (randint(1, 100) < this.wiggle_switch_probability) {
      this.wiggle_switch *= -1;
    }
    this.wiggle_pos =
      Math.sin(this.age + this.wiggle_offset + (2 * Math.PI) / this.wiggle_period) * this.wiggle_amplitude;
    if (this.age < this.wiggle_amplitude) {
      this.wiggle_pos *= this.age / this.wiggle_amplitude;
    }
    if (this.direction == 0) {
      // Going North
      this.y_pos -= this.velocity;
      this.x_pos += this.wiggle_pos * this.wiggle_switch;
    } else if (this.direction == 1) {
      // Going East
      this.x_pos += this.velocity;
      this.y_pos += this.wiggle_pos * this.wiggle_switch;
    } else if (this.direction == 2) {
      // Going South
      this.y_pos += this.velocity;
      this.x_pos -= this.wiggle_pos * this.wiggle_switch;
    } else {
      // Going West
      this.x_pos -= this.velocity;
      this.y_pos -= this.wiggle_pos * this.wiggle_switch;
    }

    if (this.age < this.max_age / 3) {
      this.green -= Math.floor(128 * (3 / this.max_age));
    } else if (this.age < (this.max_age * 2) / 3) {
      this.red -= 2 * Math.floor(128 * (3 / this.max_age));
    }
    if (this.green < 0) {
      this.green = 0;
    }
    if (this.red < 0) {
      this.red = 0;
    }
    this.red_string = this.red.toString(16);
    if (this.red < 16) {
      this.red_string = "0" + this.red_string;
    }
    this.green_string = this.green.toString(16);
    if (this.green < 16) {
      this.green_string = "0" + this.green_string;
    }
    //console.log("#" + red_string + green_string + "00");
    this.color = "#" + this.red_string + this.green_string + "00";
    this.age++;
  }

  draw(context) {
    if (this.age <= this.max_age) {
      context.fillStyle = this.color;
      context.fillRect(this.x_pos, this.y_pos, this.size, this.size);
    }
  }
}

export class timer {
  constructor() {
    this.position = [0, 0];
    this.time = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.seconds_10s = 0;
    this.seconds_1s = 0;
    this.minutes_10s = 0;
    this.minutes_1s = 0;
    this.active = false;
  }

  update(delta) {
    this.time += delta;
    if (this.time >= 1000) {
      this.seconds++;
      this.time -= 1000;
    }
    if (this.seconds >= 60) {
      this.minutes++;
      this.seconds -= 60;
    }
  }

  draw(context, timer_sprites) {
    this.seconds_1s = this.seconds % 10;
    this.seconds_10s = Math.floor(this.seconds / 10);
    this.minutes_1s = this.minutes % 10;
    this.minutes_10s = Math.floor(this.minutes / 10);

    if (this.active) {
      if (this.minutes <= 99) {
        if (this.minutes >= 10) {
          timer_sprites[this.minutes_10s].draw(context, this.position[0], this.position[1]);
        } else {
          timer_sprites[10].draw(context, this.position[0], this.position[1]);
        }
        timer_sprites[this.minutes_1s].draw(context, this.position[0] + 68, this.position[1]);
        if (this.seconds % 2) {
          timer_sprites[11].draw(context, this.position[0] + 136, this.position[1]);
        } else {
          timer_sprites[12].draw(context, this.position[0] + 136, this.position[1]);
        }
        timer_sprites[this.seconds_10s].draw(context, this.position[0] + 152, this.position[1]);
        timer_sprites[this.seconds_1s].draw(context, this.position[0] + 220, this.position[1]);
      }
    } else {
      timer_sprites[10].draw(context, this.position[0], this.position[1]);
      timer_sprites[10].draw(context, this.position[0] + 68, this.position[1]);
      timer_sprites[12].draw(context, this.position[0] + 136, this.position[1]);
      timer_sprites[10].draw(context, this.position[0] + 152, this.position[1]);
      timer_sprites[10].draw(context, this.position[0] + 220, this.position[1]);
    }
  }
}

export class hp_tracker {
  constructor() {
    this.age = 0;
    this.player_hp = 4;
    this.position = [0, 0];
    this.position_offset = [0, 0];
    this.complete = false; // This is set when the gameboard is complete.

    // These are used for jiggling the hp meter.
    this.velocity = [0, 0];
    this.spring_constant = 0.4;
    this.damping = 0.75;
    //These are used for stopping all movement when the board jiggle is small.
    this.min_jiggle_position = 1;
    this.min_jiggle_velocity = 1;
  }

  jiggle(amplitude) {
    var pi = Math.PI;
    var angle1 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    var angle2 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    this.position_offset[0] = Math.cos(angle1) * amplitude;
    this.position_offset[1] = Math.sin(angle1) * amplitude;
    this.velocity[0] = Math.cos(angle2) * amplitude;
    this.velocity[1] = Math.sin(angle2) * amplitude;
  }

  update() {
    this.age++;
    // Apply springiness to velocity
    this.velocity[0] += this.position_offset[0] * this.spring_constant * -1;
    this.velocity[1] += this.position_offset[1] * this.spring_constant * -1;
    // Apply velocity to position
    this.position_offset[0] += this.velocity[0];
    this.position_offset[1] += this.velocity[1];
    // Apply damping to velocity
    this.velocity[0] *= this.damping;
    this.velocity[1] *= this.damping;

    // Settle everything down
    if (this.position_offset[0] ** 2 + this.position_offset[1] ** 2 < this.min_jiggle_position ** 2) {
      if (this.velocity[0] ** 2 + this.velocity[1] ** 2 < this.min_jiggle_velocity ** 2) {
        this.velocity = [0, 0];
        this.position_offset = [0, 0];
      }
    }

    // Jiggle a bit when HP low.
    if (this.player_hp == 1 && this.age % 15 == 0 && !this.complete) {
      if (randint(1, 10) >= 5) {
        this.jiggle(5);
      }
    }
  }

  draw(context, bg, pip, shine) {
    bg.draw(context, this.position[0] + this.position_offset[0], this.position[1] + this.position_offset[1]);
    if (this.player_hp >= 2) {
      pip.draw(context, this.position[0] + 10, this.position[1] + 138);
    }
    if (this.player_hp >= 3) {
      pip.draw(context, this.position[0] + 176, this.position[1] + 138);
    }
    if (this.player_hp >= 4) {
      pip.draw(context, this.position[0] + 344, this.position[1] + 138);
    }
  }
}

// This class replaces the hint background entirely, whether they are currently
// being animated or not.
export class animated_hint {
  constructor(position, length, orientation, tiles_sheet) {
    var x;

    this.length = length;
    // Orientation: 0 = horizontal, 1 = vertical
    this.orientation = orientation;
    this.tiles_sheet = tiles_sheet;
    this.age = 0;
    // Position is the top left corner of the hint,
    // i.e. it's position relative to the board, not the screen.
    this.position = position;
    this.position_offset = [0, 0];
    // States:
    // 0: No hint (i.e. before the hint animates in, or after animating out);
    // 1: Currently animating in.
    // 2: Done animating in, static.
    // 3: Currently animating out.
    this.state = 0;
    // First sprite is the top or left most.
    // Sprite array is a list of arrays: [sprite object, time offset]
    this.sprite_animated_array = [];
    this.default_frame_period = 1; // twiddle.
    // Cycle time is the time between animation start of
    // successive cells.  Update based on frame period 'n stuff.
    // Twiddle, along with default_frame_period.
    this.default_cycle_time = 6;
    this.tile_size = 32;
    this.hint_single = new sprite(this.tiles_sheet, 0, 0, this.tile_size, this.tile_size);
    this.hint_top = new sprite(this.tiles_sheet, 128, 0, this.tile_size, this.tile_size);
    this.hint_bottom = new sprite(this.tiles_sheet, 192, 0, this.tile_size, this.tile_size);
    this.hint_left = new sprite(this.tiles_sheet, 256, 0, this.tile_size, this.tile_size);
    this.hint_right = new sprite(this.tiles_sheet, 320, 0, this.tile_size, this.tile_size);
    this.hint_vertical = new sprite(this.tiles_sheet, 160, 0, this.tile_size, this.tile_size);
    this.hint_horizontal = new sprite(this.tiles_sheet, 288, 0, this.tile_size, this.tile_size);

    // Number of sparks to give off per grid cell.
    this.spark_num = 40;
    // Spark array is an array of arrays of arrays.
    // The outer array is 1 element per cell of the hint.
    // The middle array is 1 element per this.spark_num.
    // The innermost array is a spark and a time at which to draw and update that spark.
    this.spark_array = [];
  }

  update() {
    var x;
    var y;
    var complete;

    for (x = 0; x < this.sprite_animated_array.length; x++) {
      if (this.sprite_animated_array[x][1] <= this.age) {
        this.sprite_animated_array[x][0].update();
      }
    }
    // Automatically transition out of the animated state if it is complete.
    if (this.state == 1) {
      complete = true;
      for (x = 0; x < this.sprite_animated_array.length; x++) {
        if (this.age < this.sprite_animated_array[x][2]) {
          complete = false;
        }
      }
      if (complete) {
        this.set_state(2);
      }
    }
    // Automatically transition out of the animated state if it is complete.
    if (this.state == 3) {
      complete = true;
      for (x = 0; x < this.sprite_animated_array.length; x++) {
        if (this.age < this.sprite_animated_array[x][2]) {
          complete = false;
        }
      }
      if (complete) {
        this.set_state(0);
      }
    }

    // Update sparks.
    if (this.spark_array.length > 0) {
      for (x = 0; x < this.spark_array.length; x++) {
        for (y = 0; y < this.spark_array[x].length; y++) {
          if (this.age >= this.spark_array[x][y][1]) {
            this.spark_array[x][y][0].update();
          }
        }
      }
    }
    this.age++;
  }

  draw(context) {
    var x;
    var y;
    var complete_cells;
    var total_position = [this.position[0] + this.position_offset[0], this.position[1] + this.position_offset[1]];

    if (this.state == 1) {
      // State 1 uses an array of offset animating sprites.
      if (this.orientation == 0) {
        // 0 orientation = horizontal
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.age >= this.sprite_animated_array[x][1] && this.age <= this.sprite_animated_array[x][2]) {
            this.sprite_animated_array[x][0].draw(
              context,
              total_position[0] + (this.sprite_animated_array.length - x - 1) * this.tile_size,
              total_position[1]
            );
          }
        }
        // This loop counts the cells that are done animating.
        complete_cells = 0;
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.sprite_animated_array[x][2] < this.age) {
            complete_cells++;
          }
        }
        if (complete_cells > 0) {
          this.draw_static_row(
            context,
            [total_position[0] + (this.length - complete_cells) * this.tile_size, total_position[1]],
            complete_cells
          );
        }
      } else if (this.orientation == 1) {
        // 1 orientation = vertical
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.age >= this.sprite_animated_array[x][1] && this.age <= this.sprite_animated_array[x][2]) {
            this.sprite_animated_array[x][0].draw(
              context,
              total_position[0],
              total_position[1] + (this.sprite_animated_array.length - x - 1) * this.tile_size
            );
          }
        }
        // This loop counts the cells that are done animating.
        complete_cells = 0;
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.sprite_animated_array[x][2] < this.age) {
            complete_cells++;
          }
        }
        if (complete_cells > 0) {
          this.draw_static_row(
            context,
            [total_position[0], total_position[1] + (this.length - complete_cells) * this.tile_size],
            complete_cells
          );
        }
      }
    } else if (this.state == 2) {
      this.draw_static_row(context, total_position, this.length);
    } else if (this.state == 3) {
      // State 3 uses an array of offset animating sprites.
      if (this.orientation == 0) {
        // 0 orientation = horizontal
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.age >= this.sprite_animated_array[x][1] && this.age <= this.sprite_animated_array[x][2]) {
            this.sprite_animated_array[x][0].draw(context, total_position[0] + x * this.tile_size, total_position[1]);
          }
        }
        // This loop counts the cells that are done animating.
        complete_cells = 0;
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          // Below, we caount a cell at index 1, because the static portion of the row
          // changes as soon as disappearing cells start animating, not when they finish.
          if (this.sprite_animated_array[x][1] < this.age) {
            complete_cells++;
          }
        }
        if (complete_cells > 0 && complete_cells < this.length) {
          this.draw_static_row(
            context,
            [total_position[0] + complete_cells * this.tile_size, total_position[1]],
            this.length - complete_cells
          );
        }
      } else if (this.orientation == 1) {
        // 1 orientation = vertical
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.age >= this.sprite_animated_array[x][1] && this.age <= this.sprite_animated_array[x][2]) {
            this.sprite_animated_array[x][0].draw(context, total_position[0], total_position[1] + x * this.tile_size);
          }
        }
        // This loop counts the cells that are done animating.
        complete_cells = 0;
        for (x = 0; x < this.sprite_animated_array.length; x++) {
          if (this.sprite_animated_array[x][1] < this.age) {
            complete_cells++;
          }
        }
        if (complete_cells > 0 && complete_cells < this.length) {
          this.draw_static_row(
            context,
            [total_position[0], total_position[1] + complete_cells * this.tile_size],
            this.length - complete_cells
          );
        }
      }
    }

    // Draw sparks
    if (this.spark_array.length > 0) {
      for (x = 0; x < this.spark_array.length; x++) {
        for (y = 0; y < this.spark_array[x].length; y++) {
          if (this.age >= this.spark_array[x][y][1]) {
            this.spark_array[x][y][0].draw(context);
          }
        }
      }
    }
  }

  set_state(state_number) {
    var x;
    var y;
    var temp_sprite;
    var start_time;
    var temp_spark;
    var spark_group = [];
    var direction;

    if (state_number == 0) {
      // State 0 means hints are not drawn.
      this.state = 0;
      this.sprite_animated_array = [];
    } else if (state_number == 1) {
      // State 1 means hints are animating in.
      this.state = 1;
      this.sprite_animated_array = [];
      for (x = 0; x < this.length; x++) {
        temp_sprite = new sprite(this.tiles_sheet, 320, 32, this.tile_size, this.tile_size);
        temp_sprite.add_frame(288, 32);
        temp_sprite.add_frame(256, 32);
        temp_sprite.add_frame(224, 32);
        temp_sprite.add_frame(192, 32);
        temp_sprite.add_frame(160, 32);
        temp_sprite.add_frame(128, 32);
        temp_sprite.add_frame(96, 32);
        temp_sprite.add_frame(0, 0);
        temp_sprite.animated = true;
        temp_sprite.frame_period = this.default_frame_period;
        start_time = this.age + this.default_cycle_time * x;
        this.sprite_animated_array.push([
          temp_sprite,
          start_time,
          temp_sprite.num_frames * temp_sprite.frame_period + 12 + start_time
        ]);
      }
    } else if (state_number == 2) {
      // State 2 means hints are drawn and static.
      this.state = 2;
      this.sprite_animated_array = [];
    } else if (state_number == 3) {
      // State 3 means hints are animating out.
      this.state = 3;
      this.sprite_animated_array = [];
      for (x = 0; x < this.length; x++) {
        temp_sprite = new sprite(this.tiles_sheet, 0, 0, this.tile_size, this.tile_size);
        temp_sprite.add_frame(96, 32);
        temp_sprite.add_frame(128, 32);
        temp_sprite.add_frame(160, 32);
        temp_sprite.add_frame(192, 32);
        temp_sprite.add_frame(224, 32);
        temp_sprite.add_frame(256, 32);
        temp_sprite.add_frame(288, 32);
        temp_sprite.add_frame(320, 32);
        temp_sprite.frame_period = this.default_frame_period;
        temp_sprite.animated = true;
        start_time = this.age + this.default_cycle_time * x;
        this.sprite_animated_array.push([
          temp_sprite,
          start_time,
          temp_sprite.num_frames * temp_sprite.frame_period + 12 + start_time
        ]);
      }
      // Create sparks.
      if (this.orientation == 0) {
        direction = 3;
      }
      if (this.orientation == 1) {
        direction = 0;
      }
      
      for (x = 0; x < this.length; x++) {
        spark_group = [];
        for (y = 0; y < this.spark_num; y++) {
          if (this.orientation == 0) {
            temp_spark = new spark(
              this.position[0] + Math.floor((Math.random() * this.tile_size)) + (x * this.tile_size),
              this.position[1] + Math.floor((Math.random() * this.tile_size)),
              direction
            );
          } else {
            temp_spark = new spark(
              this.position[0] + Math.floor((Math.random() * this.tile_size)),
              this.position[1] + Math.floor((Math.random() * this.tile_size)) + (x * this.tile_size),
              direction
            );
          }
          spark_group.push([temp_spark, (this.default_cycle_time * x) + this.age]);
        }
        this.spark_array.push(spark_group);
      }
      
      console.log("spark array:", this.spark_array);
    }
  }

  draw_static_row(context, position, length) {
    var x;
    if (length == 1) {
      this.hint_single.draw(context, position[0], position[1]);
    } else if (length == 2) {
      if (this.orientation == 0) {
        this.hint_left.draw(context, position[0], position[1]);
        this.hint_right.draw(context, position[0] + this.tile_size, position[1]);
      } else if (this.orientation == 1) {
        this.hint_top.draw(context, position[0], position[1]);
        this.hint_bottom.draw(context, position[0], position[1] + this.tile_size);
      }
    } else {
      if (this.orientation == 0) {
        this.hint_left.draw(context, position[0], position[1]);
        this.hint_right.draw(context, position[0] + (length - 1) * this.tile_size, position[1]);
        for (x = 0; x < length - 2; x++) {
          this.hint_horizontal.draw(context, position[0] + (x + 1) * this.tile_size, position[1]);
        }
      } else if (this.orientation == 1) {
        this.hint_top.draw(context, position[0], position[1]);
        this.hint_bottom.draw(context, position[0], position[1] + (length - 1) * this.tile_size);
        for (x = 0; x < length - 2; x++) {
          this.hint_vertical.draw(context, position[0], position[1] + (x + 1) * this.tile_size);
        }
      }
    }
  }
}

export class animated_grid {
  constructor(position, size, board_grid_sheet) {
    this.position = position;
    this.position_offset = [0, 0];
    this.velocity = [0, 0];
    this.spring_constant = 0.4; // Twiddle
    this.damping = 0.75; // Twiddle
    // Size is an array: [width, height]
    this.size = size;
    // regulation sizes are 5, 10, 15, 20.  This variable is 0 if the board is not
    // one of those sizes squared.
    if (size[0] != size[1]) {
      this.regulation_size = 0;
    } else if (this.size[0] == 5 || this.size[0] == 10 || this.size[0] == 15 || this.size[0] == 20) {
      this.regulation_size = this.size[0];
    } else {
      this.regulation_size = 0;
    }

    this.board_grid_sheet = board_grid_sheet;
    this.tile_size = 32;
    // States are: 0 - Not visible; 1 - animating in; 2 - visible and static; 3 - animating out.
    this.state = 0;
    this.failed = false;
    this.sprite_animated_array_outer = [];
    this.sprite_animated_array_inner_vertical = [];
    this.sprite_animated_array_inner_horizontal = [];
    this.default_frame_period = 2; // Twiddle
    this.animation_start_variance = 20; // Twiddle
    this.green_sprites = {
      horizontal: new sprite(this.board_grid_sheet, 32, 0, 32, 4),
      vertical: new sprite(this.board_grid_sheet, 0, 0, 4, 32),
      corner_tl: new sprite(this.board_grid_sheet, 64, 0, 4, 4),
      corner_tr: new sprite(this.board_grid_sheet, 80, 0, 4, 4),
      corner_bl: new sprite(this.board_grid_sheet, 64, 16, 4, 4),
      corner_br: new sprite(this.board_grid_sheet, 80, 16, 4, 4),
      t_top: new sprite(this.board_grid_sheet, 72, 0, 4, 4),
      t_left: new sprite(this.board_grid_sheet, 64, 8, 4, 4),
      t_right: new sprite(this.board_grid_sheet, 80, 8, 4, 4),
      t_bottom: new sprite(this.board_grid_sheet, 72, 16, 4, 4),
      cross: new sprite(this.board_grid_sheet, 72, 8, 4, 4)
    };

    this.red_sprites = {
      horizontal: new sprite(this.board_grid_sheet, 32, 32, 32, 4),
      vertical: new sprite(this.board_grid_sheet, 0, 32, 4, 32),
      corner_tl: new sprite(this.board_grid_sheet, 64, 32, 4, 4),
      corner_tr: new sprite(this.board_grid_sheet, 80, 32, 4, 4),
      corner_bl: new sprite(this.board_grid_sheet, 64, 48, 4, 4),
      corner_br: new sprite(this.board_grid_sheet, 80, 48, 4, 4),
      t_top: new sprite(this.board_grid_sheet, 72, 32, 4, 4),
      t_left: new sprite(this.board_grid_sheet, 64, 40, 4, 4),
      t_right: new sprite(this.board_grid_sheet, 80, 40, 4, 4),
      t_bottom: new sprite(this.board_grid_sheet, 72, 48, 4, 4),
      cross: new sprite(this.board_grid_sheet, 72, 40, 4, 4)
    };

    this.sprites_in_use = this.green_sprites;
    this.sprite_color_timer = 0;
    // This is how long the grid flashes its wrong color.  Twiddle.
    this.red_blink_time = 30; 
    // line_half_width is basically for how thick the lines are, so they can straddle grid lines.
    this.line_half_width = 2;

    this.animate_start = 0;
    // Cycle time is how long it takes an animated bit to finish animating.
    // We're assuming 6 frames in the animationg.
    this.cycle_time = 6 * (this.default_frame_period + 1);
    this.age = 0;
  }

  update() {
    var x;

    // Jiggle physics 
    // Apply springiness to velocity
    this.velocity[0] += this.position_offset[0] * this.spring_constant * -1;
    this.velocity[1] += this.position_offset[1] * this.spring_constant * -1;
    // Apply velocity to position
    this.position_offset[0] += this.velocity[0];
    this.position_offset[1] += this.velocity[1];
    // Apply damping to velocity
    this.velocity[0] *= this.damping;
    this.velocity[1] *= this.damping;

    // Settle everything down
    if (this.position_offset[0] ** 2 + this.position_offset[1] ** 2 < this.min_jiggle_position ** 2) {
      if (this.velocity[0] ** 2 + this.velocity[1] ** 2 < this.min_jiggle_velocity ** 2) {
        this.velocity = [0, 0];
        this.position_offset = [0, 0];
      }
    }

    // Update animating grid elements, if necessary.
    if (this.state == 1 || this.state == 3) {
      for (x = 0; x < this.sprite_animated_array_outer.length; x++) {
        if (this.age - this.animate_start >= this.sprite_animated_array_outer[x][1]) {
          this.sprite_animated_array_outer[x][0].update(); 
        }
      }
      for (x = 0; x < this.sprite_animated_array_inner_horizontal.length; x++) {
        if ( this.age - this.animate_start >= this.sprite_animated_array_inner_horizontal[x][1]) {
          this.sprite_animated_array_inner_horizontal[x][0].update();
        }
      }
      for (x = 0; x < this.sprite_animated_array_inner_vertical.length; x++) {
        if (this.age - this.animate_start >= this.sprite_animated_array_inner_vertical[x][1]) {
          this.sprite_animated_array_inner_vertical[x][0].update();
        }
      }
    }

    // After the grid is done animating in, it should set itself to state 2 (static 'in').
    if (this.state == 1) {
      // The number 5 in the following IF is a little fudge factor.
      if (this.age > this.cycle_time + this.animation_start_variance + this.animate_start + 5) {
        this.set_state(2);
      }
    }

    // After the grid is done animating out, it should set itself to state 0 (not drawn).
    if (this.state == 3) {
      if (this.age > this.cycle_time + this.animation_start_variance + this.animate_start + 5) {
        this.set_state(0);
      }
    }

    if (this.sprite_color_timer > 0) {
      this.sprite_color_timer--;
    }
    if (this.sprite_color_timer == 0 && !this.failed) {
      this.set_color(0);
    }

    this.age++;
  }

  draw(context) {
    var x;
    var y;
    var total_position = [this.position[0] + this.position_offset[0], this.position[1] + this.position_offset[1]];
    var inner_rows;
    if (this.regulation_size > 0) {
      inner_rows = this.regulation_size / 5 - 1;
    }

    if (this.state == 0) {
      return;

    } else if (this.state == 1 || this.state == 3) {
      // Draw outer frame in one loop.
      for (x = 0; x < this.size[0]; x++) {
        // Top row
        this.sprite_animated_array_outer[x][0].draw(
          context,
          total_position[0] + (this.tile_size * x),
          total_position[1] - this.line_half_width
        );
        // Bottom row.
        this.sprite_animated_array_outer[x + this.size[0]][0].draw(
          context,
          total_position[0] + (this.tile_size * x),
          total_position[1] + (this.size[1] * this.tile_size) - this.line_half_width
        );
        // Left column
        this.sprite_animated_array_outer[x + (2 * this.size[0])][0].draw(
          context,
          total_position[0] - this.line_half_width,
          total_position[1] + (this.tile_size * x)
        );
        // Right column
        this.sprite_animated_array_outer[x + (2 * this.size[0]) + this.size[1]][0].draw(
          context,
          total_position[0] + (this.size[0] * this.tile_size) - this.line_half_width,
          total_position[1] + (x * this.tile_size) - this.line_half_width
        );
      }
      
      
      
      // Draw the inner horizontal lines.
      if (this.regulation_size > 0) {
        // Iterate over the number of inner rows (i.e. 2 for a 15x board)
        for (x = 0; x < (this.regulation_size / 5) - 1; x++) {
          // Iterate over the width of the board.
          for (y = 0; y < this.size[0]; y++) {
              this.sprite_animated_array_inner_horizontal[5 * x + y][0].draw(
                context,
                total_position[0] + this.tile_size * y,
                total_position[1] + this.tile_size * (x + 1) * 5 - this.line_half_width
              );            
          }
        }
        
        // Iterate over the number of inner columns (i.e. 2 for a 15x board)
        for (x = 0; x < this.regulation_size / 5 - 1; x++) {
          // Iterate over the height of the board.
          for (y = 0; y < this.size[1]; y++) {
              this.sprite_animated_array_inner_vertical[5 * x + y][0].draw(
                context,
                total_position[0] + this.tile_size * (x + 1) * 5 - this.line_half_width,
                total_position[1] + this.tile_size * y
              );         
          }
        }
      }
    } else if (this.state == 2) {
      // Draw the top and bottom rows of horizontal members.
      for (x = 0; x < this.size[0]; x++) {
        this.sprites_in_use.horizontal.draw(
          context,
          total_position[0] + x * this.tile_size,
          total_position[1] - this.line_half_width
        );
        this.sprites_in_use.horizontal.draw(
          context,
          total_position[0] + this.tile_size * x,
          total_position[1] + this.tile_size * this.size[1] - this.line_half_width
        );
      }
      
      // If we're regulation size, draw the inner horizontal members.
      if (this.regulation_size > 0) {
        // Iterate over the number of inner horizontal lines.
        for (x = 0; x < this.regulation_size / 5 - 1; x++) {
          // Iterate over the width of the board.
          for (y = 0; y < this.size[0]; y++) {
            this.sprites_in_use.horizontal.draw(
              context,
              total_position[0] + this.tile_size * y,
              total_position[1] + this.tile_size * (x + 1) * 5 - this.line_half_width
            );
          }
        }
      }
      // Draw the left and right columns of vertical members.
      for (x = 0; x < this.size[0]; x++) {
        this.sprites_in_use.vertical.draw(
          context,
          total_position[0] - this.line_half_width,
          total_position[1] + x * this.tile_size
        );
        this.sprites_in_use.vertical.draw(
          context,
          total_position[0] + this.size[0] * this.tile_size - this.line_half_width,
          total_position[1] + x * this.tile_size
        );
      }
      // If we're regulation size, draw the inner vertical members.
      if (this.regulation_size > 0) {
        // Iterate over the number of inner horizontal lines.
        for (x = 0; x < inner_rows; x++) {
          // Iterate over the width of the board.
          for (y = 0; y < this.size[1]; y++) {
            this.sprites_in_use.vertical.draw(
              context,
              total_position[0] + (x + 1) * 5 * this.tile_size - this.line_half_width,
              total_position[1] + y * this.tile_size
            );
          }
        }
      }
      // Draw corners.
      this.sprites_in_use.corner_tl.draw(
        context,
        total_position[0] - this.line_half_width,
        total_position[1] - this.line_half_width
      );
      this.sprites_in_use.corner_tr.draw(
        context,
        total_position[0] + this.size[0] * this.tile_size - this.line_half_width,
        total_position[1] - this.line_half_width
      );
      this.sprites_in_use.corner_bl.draw(
        context,
        total_position[0] - this.line_half_width,
        total_position[1] + this.size[1] * this.tile_size - this.line_half_width
      );
      this.sprites_in_use.corner_br.draw(
        context,
        total_position[0] + this.size[0] * this.tile_size - this.line_half_width,
        total_position[1] + this.size[1] * this.tile_size - this.line_half_width
      );

      // Every other intersection only happens on regulation boards
      if (this.regulation_size > 0) {
        // Draw Ts.  We can recycle this one loop for all Ts.
        for (x = 0; x < inner_rows; x++) {
          this.sprites_in_use.t_top.draw(
            context,
            total_position[0] + (x + 1) * 5 * this.tile_size - this.line_half_width,
            total_position[1] - this.line_half_width
          );
          this.sprites_in_use.t_left.draw(
            context,
            total_position[0] - this.line_half_width,
            total_position[1] + (x + 1) * 5 * this.tile_size - this.line_half_width
          );
          this.sprites_in_use.t_right.draw(
            context,
            total_position[0] + (this.size[0] * this.tile_size) - this.line_half_width,
            total_position[1] + (x + 1) * 5 * this.tile_size - this.line_half_width
          );
          this.sprites_in_use.t_bottom.draw(
            context,
            total_position[0] + (x + 1) * 5 * this.tile_size - this.line_half_width,
            total_position[1] + (this.size[1] * this.tile_size) - this.line_half_width
          );
        }
        // Draw intersections.
        for (x = 1; x <= inner_rows; x++) {
          for( y = 1; y <= inner_rows; y++) {
            this.sprites_in_use.cross.draw(
              context,
              total_position[0] + (5 * x * this.tile_size) - this.line_half_width + 8,
              total_position[1] + (5 * y * this.tile_size) - this.line_half_width
            );
          }
        }
      }
    }
  }

  set_state(state_num) {
    var temp_sprite;
    var start_time = 0;
    var x;
    var y;

    console.log("Setting state to", state_num);
    if (state_num == 0) {
      this.state = 0;
      this.sprite_animated_array_outer = [];
      this.sprite_animated_array_inner_horizontal = [];
      this.sprite_animated_array_inner_vertical = [];

      // State 1 is animating in.
    } else if (state_num == 1) {
      this.state = 1;
      this.sprite_animated_array_outer = [];
      this.sprite_animated_array_inner_horizontal = [];
      this.sprite_animated_array_inner_vertical = [];
      this.animate_start = this.age;
      // We do 2 passes: create the outer border, and then if regulation size, do the inner grid.
      // The intersectinos never need animated, so they don't go in this array.
      for (x = 0; x < 2 * this.size[0]; x++) {
        temp_sprite = new sprite(this.board_grid_sheet, 32, 28, 32, 4);
        temp_sprite.add_frame(32, 24);
        temp_sprite.add_frame(32, 18);
        temp_sprite.add_frame(32, 12);
        temp_sprite.add_frame(32, 6);
        temp_sprite.add_frame(32, 0);
        temp_sprite.frame_period = this.default_frame_period;
        temp_sprite.animated = true;
        start_time = randint(0, this.animation_start_variance);
        this.sprite_animated_array_outer.push([temp_sprite, start_time]);
      }
      for (x = 0; x < 2 * this.size[1]; x++) {
        temp_sprite = new sprite(this.board_grid_sheet, 28, 0, 4, 32); 
        temp_sprite.add_frame(24, 0);
        temp_sprite.add_frame(18, 0);
        temp_sprite.add_frame(12, 0);
        temp_sprite.add_frame(6, 0);
        temp_sprite.add_frame(0, 0);
        temp_sprite.frame_period = this.default_frame_period;
        temp_sprite.animated = true;
        start_time = randint(0, this.animation_start_variance);
        this.sprite_animated_array_outer.push([temp_sprite, start_time]);
      }
      if (this.regulation_size > 0) {
        // Outer loop iterates over the number of inner grid lines (1 for 10x, 2 for 15x etc.)
        // Remember, regulation size boards are always square, so we only need 1 outer loop.
        for (x = 0; x < this.regulation_size / 5 - 1; x++) {
          // Inner loop iterates over the length of the grid line (10 for 10x, 15 for 15x, etc.)
          for (y = 0; y < this.size[0]; y++) {
            temp_sprite = new sprite(this.board_grid_sheet, 32, 28, 32, 4);
            temp_sprite.add_frame(32, 24);
            temp_sprite.add_frame(32, 18);
            temp_sprite.add_frame(32, 12);
            temp_sprite.add_frame(32, 6);
            temp_sprite.add_frame(32, 0);
            temp_sprite.frame_period = this.default_frame_period;
            temp_sprite.animated = true;
            start_time = randint(0, this.animation_start_variance);
            this.sprite_animated_array_inner_horizontal.push([temp_sprite, start_time]);
          }
          for (y = 0; y < this.size[1]; y++) {
            temp_sprite = new sprite(this.board_grid_sheet, 28, 0, 4, 32);
            temp_sprite.add_frame(24, 0);
            temp_sprite.add_frame(18, 0);
            temp_sprite.add_frame(12, 0);
            temp_sprite.add_frame(6, 0);
            temp_sprite.add_frame(0, 0);
            temp_sprite.frame_period = this.default_frame_period;
            temp_sprite.animated = true;
            start_time = randint(0, this.animation_start_variance);
            this.sprite_animated_array_inner_vertical.push([temp_sprite, start_time]);
          }
        }
      }
      
    } else if (state_num == 2) {
      this.state = 2;
      this.sprite_animated_array_outer = [];
      this.sprite_animated_array_inner_horizontal = [];
      this.sprite_animated_array_inner_vertical = [];
    } else if (state_num == 3) {
      this.state = 3;
      this.sprite_animated_array_outer = [];
      this.sprite_animated_array_inner_horizontal = [];
      this.sprite_animated_array_inner_vertical = [];
      this.animate_start = this.age;
      // We do 2 passes: create the outer border, and then if regulation size, do the inner grid.
      // The intersectinos never need animated, so they don't go in this array.
      for (x = 0; x < 2 * this.size[0]; x++) {
        temp_sprite = new sprite(this.board_grid_sheet, 32, 0, 32, 4);
        temp_sprite.add_frame(32, 6);
        temp_sprite.add_frame(32, 12);
        temp_sprite.add_frame(32, 18);
        temp_sprite.add_frame(32, 24);
        temp_sprite.add_frame(32, 28);
        temp_sprite.frame_period = this.default_frame_period;
        temp_sprite.animated = true;
        start_time = randint(0, this.animation_start_variance);
        this.sprite_animated_array_outer.push([temp_sprite, start_time]);
      }
      for (x = 0; x < 2 * this.size[1]; x++) {
        temp_sprite = new sprite(this.board_grid_sheet, 0, 0, 4, 32);
        temp_sprite.add_frame(6, 0);
        temp_sprite.add_frame(12, 0);
        temp_sprite.add_frame(18, 0);
        temp_sprite.add_frame(24, 0);
        temp_sprite.add_frame(28, 0);
        temp_sprite.frame_period = this.default_frame_period;
        temp_sprite.animated = true;
        start_time = randint(0, this.animation_start_variance);
        this.sprite_animated_array_outer.push([temp_sprite, start_time]);
      }
      if (this.regulation_size > 0) {
        // Outer loop iterates over the number of inner grid lines (1 for 10x, 2 for 15x etc.)
        // Remember, regulation size boards are always square, so we only need 1 outer loop.
        for (x = 0; x < this.regulation_size / 5 - 1; x++) {
          // Inner loop iterates over the length of the grid line (10 for 10x, 15 for 15x, etc.)
          for (y = 0; y < this.size[0]; y++) {
            temp_sprite = new sprite(this.board_grid_sheet, 32, 0, 32, 4);
            temp_sprite.add_frame(32, 6);
            temp_sprite.add_frame(32, 12);
            temp_sprite.add_frame(32, 18);
            temp_sprite.add_frame(32, 24);
            temp_sprite.add_frame(32, 28);
            temp_sprite.frame_period = this.default_frame_period;
            temp_sprite.animated = true;
            start_time = randint(0, this.animation_start_variance);
            this.sprite_animated_array_inner_horizontal.push([temp_sprite, start_time]);
          }
          for (y = 0; y < this.size[1]; y++) {
            temp_sprite = new sprite(this.board_grid_sheet, 0, 0, 4, 32);
            temp_sprite.add_frame(6, 0);
            temp_sprite.add_frame(12, 0);
            temp_sprite.add_frame(18, 0);
            temp_sprite.add_frame(24, 0);
            temp_sprite.add_frame(28, 0);
            temp_sprite.frame_period = this.default_frame_period;
            temp_sprite.animated = true;
            start_time = randint(0, this.animation_start_variance);
            this.sprite_animated_array_inner_vertical.push([temp_sprite, start_time]);
          }
        }
      }
    }
  }

  set_color(color) {
    // Color is 0 for gren, 1 (or anything else) for red.
    if (color == 0) {
      this.sprites_in_use = this.green_sprites;
    } else {
      this.sprites_in_use = this.red_sprites;
      this.sprite_color_timer = this.red_blink_time;
    }
  }

  jiggle(amplitude) {
    var pi = Math.PI;
    var angle1 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    var angle2 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    this.position_offset[0] = Math.cos(angle1) * amplitude;
    this.position_offset[1] = Math.sin(angle1) * amplitude;
    this.velocity[0] = Math.cos(angle2) * amplitude;
    this.velocity[1] = Math.sin(angle2) * amplitude;
  }
}

export class game_board {
  constructor() {
    // Size of the board to be drawn, x and y grid size.
    this.size_x = 5;
    this.size_y = 5;
    // Complete is to be true when the player has completed the puzzle.
    this.complete = false;
    this.complete_last_check = false;
    // Secret_complete is used when checking the solvability of a generated puzzle.
    this.secret_complete = false;
    // This board's position on the screen.
    this.position = [400, 40];
    // This is for jiggling the board, as when a player misclicks.
    this.position_offset = [0.0, 0.0];
    // These are for the physics of board jiggle.
    this.velocity = [0.0, 0.0];
    this.spring_constant = 0.4; // Twiddle.
    this.damping = 0.75; // Twiddle
    //These are used for stopping all movement when the board jiggle is small.
    this.min_jiggle_position = 1;
    this.min_jiggle_velocity = 1;
    // Default puzzle (not solvable though)
    this.solution = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    // Default player progress i.e. no progress.
    this.current_state = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    // This tracks the attempt to solve the board to test its solvability.
    this.secret_state = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    // Hints for solving the board, generated from .solution
    this.hints_row = [[0], [0], [0], [0], [0]];
    this.hints_col = [[0], [0], [0], [0], [0]];
    // hints_row_current and hints_col_current are for animating the row/col hint spaces.
    // hints_row_complete and hints_col complete are too.
    this.hints_row_current = [1, 1, 1, 1, 1];
    this.hints_col_current = [1, 1, 1, 1, 1];
    this.hints_row_complete = [false, false, false, false, false];
    this.hints_col_complete = [false, false, false, false, false];
    this.hints_row_length = 1;
    this.hints_col_length = 1;
    // Animating rows and columns are lists of rows and columns that need animating after completion.
    this.animating_row_hints = [];
    this.animating_col_hints = [];
    this.animating_grid_rows = [];
    this.animating_grid_cols = [];

    // These are for tracking what we're click-dragging across.  -1 for crossed cells, 1 for filled cells.
    this.hold_on = 0;

    // Tile size, both for rendering and for checking which cell on the board we're clicking.
    this.tile_size = 32;
    this.tiles_sheet = false;
    this.sprites_tiles = false;
    this.numbers_sheet = false;
    this.sprites_numbers = false;
    this.board_grid_sheet = false;
    this.sprites_board_grid = false;
    this.board_countdown_sheet = false;
    this.sprites_board_countdown = false;
    this.filled_cell_sprites = [];
    this.failed = false;
    this.failed_this_frame = true;

    this.regulation_size = false;

    // These variables are for tracking the introduction state for the board.
    // 'Failed' should be one of these states, but I won't change that at this point.
    // Having a single variable (or other object) to track arbitrary states for something
    // complex like the game board is probably a good idea.

    // Intro states go 3 > 2 > 1 > 0.  '0' means playable, the other numbers correspond to the countdown.
    this.intro_state = 3;
    this.intro_period = 60; // 60 frames, i.e. 1 second.  Twiddle this.

    // Grid is set up in the 'setup board' function.
    this.default_grid;

    this.age = 0;
  }

  setup_board(size_x, size_y, position, tiles_sheet, numbers_sheet, board_grid_sheet, board_countdown_sheet) {
    var x = 0;

    console.log("Starting setup board");
    this.solution = this.random_board_method_2(size_x, size_y);
    var solvable = false;
    while (solvable == false) {
      if (this.solve_board()) {
        solvable = true;
        console.log("Found a good test board.");
      } else {
        console.log("Test board is unsolvable, regenerating...");
        this.solution = this.random_board_method_2(size_x, size_y);
        this.update_hints();
      }
    }
    console.log("position:", position);
    this.position = position;
    this.hints_row_current = [];
    this.hints_col_current = [];
    this.hints_row_complete = [];
    this.hints_col_complete = [];
    // For each column (x), if the hints are '0' then the column (hints_col_complete[x]) starts complete,
    // otherwise the column starts 'false' i.e. not complete.
    for (x = 0; x < this.size_x; x++) {
      // hints_col_current is the length of the row for animating the build up/burn down animations.
      // Might not be used.
      this.hints_col_current.push(this.hints_col_length);
      if (this.hints_col[x] == 0) {
        this.hints_col_complete.push(true);
      } else {
        this.hints_col_complete.push(false);
      }
    }
    // Same as above, for rows.
    for (x = 0; x < this.size_y; x++) {
      this.hints_row_current.push(this.hints_row_length);
      if (this.hints_row[x] == 0) {
        this.hints_row_complete.push(true);
      } else {
        this.hints_row_complete.push(false);
      }
    }
    this.tiles_sheet = tiles_sheet;
    this.numbers_sheet = numbers_sheet;
    this.board_grid_sheet = board_grid_sheet;
    this.board_countdown_sheet = board_countdown_sheet;
    this.sprites_tiles = this.make_tiles_sprites(tiles_sheet);
    this.sprites_numbers = this.make_numbers_sprites(numbers_sheet);
    this.sprites_board_countdown = this.make_board_countdown_sprites(board_countdown_sheet);

    if (this.size_x == 10 && this.size_y == 10) {
      this.regulation_size = true;
    } else if (this.size_x == 15 && this.size_y == 15) {
      this.regulation_size = true;
    } else if (this.size_x == 20 && this.size_y == 20) {
      this.regulation_size = true;
    }
    var temp_position = [0, 0];
    this.initialize_hint_animations(randint(0, 7));

    // Set up an animated grid.  Fortunately, we only need the one.
    this.default_grid = new animated_grid(
      [this.position[0] + (this.hints_row_length * this.tile_size), this.position[1] + (this.hints_col_length * this.tile_size)],
      [this.size_x, this.size_y],
      this.board_grid_sheet
    );
  }

  make_tiles_sprites(tiles_sheet) {
    var sprites_tiles = {
      board_cell_blank: new sprite(tiles_sheet, 0, 0, 32, 32),
      board_cell_cross: new sprite(tiles_sheet, 32, 0, 32, 32),
      board_cell_fill: new sprite(tiles_sheet, 64, 0, 32, 32),
      board_cell_wrong: new sprite(tiles_sheet, 352, 0, 32, 32),
      board_col_hint_single: new sprite(tiles_sheet, 96, 0, 32, 32),
      board_col_hint_top: new sprite(tiles_sheet, 128, 0, 32, 32),
      board_col_hint_mid: new sprite(tiles_sheet, 160, 0, 32, 32),
      board_col_hint_bottom: new sprite(tiles_sheet, 192, 0, 32, 32),
      board_row_hint_single: new sprite(tiles_sheet, 224, 0, 32, 32),
      board_row_hint_left: new sprite(tiles_sheet, 256, 0, 32, 32),
      board_row_hint_mid: new sprite(tiles_sheet, 288, 0, 32, 32),
      board_row_hint_right: new sprite(tiles_sheet, 320, 0, 32, 32),
      board_cross_edge_left: new sprite(tiles_sheet, 370, 32, 5, 32),
      board_cross_edge_right: new sprite(tiles_sheet, 379, 32, 5, 32),
      board_cross_edge_up: new sprite(tiles_sheet, 388, 32, 32, 5),
      board_cross_edge_down: new sprite(tiles_sheet, 388, 41, 32, 5),
      board_cross_corner_out_ul: new sprite(tiles_sheet, 388, 50, 5, 5),
      board_cross_corner_out_ur: new sprite(tiles_sheet, 397, 50, 5, 5),
      board_cross_corner_out_dl: new sprite(tiles_sheet, 388, 59, 5, 5),
      board_cross_corner_out_dr: new sprite(tiles_sheet, 397, 59, 5, 5),
      board_cross_corner_in_ul: new sprite(tiles_sheet, 406, 50, 5, 5),
      board_cross_corner_in_ur: new sprite(tiles_sheet, 415, 50, 5, 5),
      board_cross_corner_in_dl: new sprite(tiles_sheet, 406, 59, 5, 5),
      board_cross_corner_in_dr: new sprite(tiles_sheet, 415, 59, 5, 5),
      board_grid_line_vertical: new sprite(tiles_sheet, 384, 0, 4, 32),
      board_grid_line_horiz: new sprite(tiles_sheet, 388, 0, 32, 4),
      board_grid_cap_top_left: new sprite(tiles_sheet, 388, 4, 4, 4),
      board_grid_cap_top_t: new sprite(tiles_sheet, 396, 4, 4, 4),
      board_grid_cap_top_right: new sprite(tiles_sheet, 404, 4, 4, 4),
      board_grid_cap_left_t: new sprite(tiles_sheet, 388, 12, 4, 4),
      board_grid_cap_center: new sprite(tiles_sheet, 396, 12, 4, 4),
      board_grid_cap_right_t: new sprite(tiles_sheet, 404, 12, 4, 4),
      board_grid_cap_bottom_left: new sprite(tiles_sheet, 388, 20, 4, 4),
      board_grid_cap_bottom_t: new sprite(tiles_sheet, 396, 20, 4, 4),
      board_grid_cap_bottom_right: new sprite(tiles_sheet, 404, 20, 4, 4)
    };
    return sprites_tiles;
  }

  make_numbers_sprites(numbers_sheet) {
    var sprites_numbers = [
      new sprite(numbers_sheet, 0, 0, 32, 32),
      new sprite(numbers_sheet, 32, 0, 32, 32),
      new sprite(numbers_sheet, 64, 0, 32, 32),
      new sprite(numbers_sheet, 96, 0, 32, 32),
      new sprite(numbers_sheet, 128, 0, 32, 32),
      new sprite(numbers_sheet, 160, 0, 32, 32),
      new sprite(numbers_sheet, 192, 0, 32, 32),
      new sprite(numbers_sheet, 224, 0, 32, 32),
      new sprite(numbers_sheet, 256, 0, 32, 32),
      new sprite(numbers_sheet, 288, 0, 32, 32),
      new sprite(numbers_sheet, 0, 32, 32, 32),
      new sprite(numbers_sheet, 32, 32, 32, 32),
      new sprite(numbers_sheet, 64, 32, 32, 32),
      new sprite(numbers_sheet, 96, 32, 32, 32),
      new sprite(numbers_sheet, 128, 32, 32, 32),
      new sprite(numbers_sheet, 160, 32, 32, 32),
      new sprite(numbers_sheet, 192, 32, 32, 32),
      new sprite(numbers_sheet, 224, 32, 32, 32),
      new sprite(numbers_sheet, 256, 32, 32, 32),
      new sprite(numbers_sheet, 288, 32, 32, 32),
      new sprite(numbers_sheet, 0, 64, 32, 32),
      new sprite(numbers_sheet, 32, 64, 32, 32),
      new sprite(numbers_sheet, 64, 64, 32, 32),
      new sprite(numbers_sheet, 96, 64, 32, 32),
      new sprite(numbers_sheet, 128, 64, 32, 32),
      new sprite(numbers_sheet, 160, 64, 32, 32)
    ];
    return sprites_numbers;
  }

  // make_board_grid_sprites(board_grid_sheet) {
  //   var board_grid_sprites = {
  //     green_line_vertical: new sprite(board_grid_sheet, 0, 0, 5, 32),
  //     green_line_horiz: new sprite(board_grid_sheet, 32, 0, 32, 5),
  //     green_cap_top_left: new sprite(board_grid_sheet, 64, 0, 5, 5),
  //     green_cap_top_t: new sprite(board_grid_sheet, 72, 0, 5, 5),
  //     green_cap_top_right: new sprite(board_grid_sheet, 80, 0, 5, 5),
  //     green_cap_left_t: new sprite(board_grid_sheet, 64, 8, 5, 5),
  //     green_cap_center: new sprite(board_grid_sheet, 72, 8, 5, 5),
  //     green_cap_right_t: new sprite(board_grid_sheet, 80, 8, 5, 5),
  //     green_cap_bottom_left: new sprite(board_grid_sheet, 64, 16, 5, 5),
  //     green_cap_bottom_t: new sprite(board_grid_sheet, 72, 16, 5, 5),
  //     green_cap_bottom_right: new sprite(board_grid_sheet, 80, 16, 5, 5),
  //     red_line_vertical: new sprite(board_grid_sheet, 0, 32, 5, 32),
  //     red_line_horiz: new sprite(board_grid_sheet, 32, 32, 32, 5),
  //     red_cap_top_left: new sprite(board_grid_sheet, 64, 32, 5, 5),
  //     red_cap_top_t: new sprite(board_grid_sheet, 72, 32, 5, 5),
  //     red_cap_top_right: new sprite(board_grid_sheet, 80, 32, 5, 5),
  //     red_cap_left_t: new sprite(board_grid_sheet, 64, 40, 5, 5),
  //     red_cap_center: new sprite(board_grid_sheet, 72, 40, 5, 5),
  //     red_cap_right_t: new sprite(board_grid_sheet, 80, 40, 5, 5),
  //     red_cap_bottom_left: new sprite(board_grid_sheet, 64, 48, 5, 5),
  //     red_cap_bottom_t: new sprite(board_grid_sheet, 72, 48, 5, 5),
  //     red_cap_bottom_right: new sprite(board_grid_sheet, 80, 48, 5, 5)
  //   };
  //   return board_grid_sprites;
  // }

  make_board_countdown_sprites(board_countdown_sheet) {
    var board_countdown_sprites = {
      count_5x_3: new sprite(board_countdown_sheet, 160, 0, 160, 160),
      count_5x_2: new sprite(board_countdown_sheet, 160, 160, 160, 160),
      count_5x_1: new sprite(board_countdown_sheet, 0, 160, 160, 160),
      count_10x_3: new sprite(board_countdown_sheet, 320, 0, 320, 320),
      count_10x_2: new sprite(board_countdown_sheet, 320, 320, 320, 320),
      count_10x_1: new sprite(board_countdown_sheet, 320, 0, 320, 320),
      count_15x_3: new sprite(board_countdown_sheet, 1280, 960, 480, 480),
      count_15x_2: new sprite(board_countdown_sheet, 1280, 480, 480, 480),
      count_15x_1: new sprite(board_countdown_sheet, 1280, 0, 480, 480),
      count_20x_3: new sprite(board_countdown_sheet, 640, 0, 640, 640),
      count_20x_2: new sprite(board_countdown_sheet, 640, 640, 640, 640),
      count_20x_1: new sprite(board_countdown_sheet, 0, 640, 640, 640)
    };
    return board_countdown_sprites;
  }

  //This finds how much space we need to diaplay row hints.
  find_hints_row_length() {
    this.hints_row_length = 0;
    var x;
    for (x = 0; x < this.hints_row.length; x++) {
      this.hints_row_length = Math.max(this.hints_row_length, this.hints_row[x].length);
    }
  }

  //This finds how much space we need to diaplay col hints.
  find_hints_col_length() {
    this.hints_col_length = 0;
    var x;
    for (x = 0; x < this.hints_col.length; x++) {
      this.hints_col_length = Math.max(this.hints_col_length, this.hints_col[x].length);
    }
  }

  // This calculates is called every frame, and updates jiggle and animations on the board.
  update(delta, mouse_state) {
    var x = 0;
    var y = 0;
    var row_became_complete = false;
    var new_animating_row;

    

    if (this.age >= this.intro_period) {
      if (this.age == 2 * this.intro_period) {
        this.intro_state = 2;
      } else if (this.age == 3 * this.intro_period) {
        this.intro_state = 1;
      } else if (this.age == 4 * this.intro_period) {
        this.intro_state = 0;
        // Check for '0' rows/cols, i.e. totally empty rows.
        for (x = 0; x < this.size_x; x++) {
          if (this.hints_col[x] == 0) {
            this.animating_col_hints[x][0].set_state(3);
          }
        }
        for (x = 0; x < this.size_y; x++) {
          if (this.hints_row[x] == 0) {
            this.animating_row_hints[x][0].set_state(3);
          }
        }

        
        // Set animating grid to state 1
        this.default_grid.set_state(1);
      }
    }

    if (this.failed) {
      this.default_grid.failed = true;
    }

    // Apply springiness to velocity
    this.velocity[0] += this.position_offset[0] * this.spring_constant * -1;
    this.velocity[1] += this.position_offset[1] * this.spring_constant * -1;
    // Apply velocity to position
    this.position_offset[0] += this.velocity[0];
    this.position_offset[1] += this.velocity[1];
    // Apply damping to velocity
    this.velocity[0] *= this.damping;
    this.velocity[1] *= this.damping;

    // Settle everything down
    if (this.position_offset[0] ** 2 + this.position_offset[1] ** 2 < this.min_jiggle_position ** 2) {
      if (this.velocity[0] ** 2 + this.velocity[1] ** 2 < this.min_jiggle_velocity ** 2) {
        this.velocity = [0, 0];
        this.position_offset = [0, 0];
      }
    }

    // Update mouse state stuff.
    // Hold_on has to do with what kind of input we're dragging.
    if (mouse_state.mouse1_click_end == 1) {
      this.hold_on = 0;
    }
    if (mouse_state.mouse2_click_end == 1) {
      this.hold_on = 0;
    }

    // Updated animated things (just filled cells for now);
    var x = 0;
    for (x = 0; x < this.filled_cell_sprites.length; x++) {
      this.filled_cell_sprites[x][0].update();
    }

    // Check if row and col hints are complete.
    for (x = 0; x < this.size_x; x++) {
      row_became_complete = this.hints_col_complete[x];
      this.hints_col_complete[x] = true;
      for (y = 0; y < this.size_y; y++) {
        if (this.solution[y][x] == 1 && this.current_state[y][x] != 1) {
          this.hints_col_complete[x] = false;
        }
      }
      if (row_became_complete != this.hints_col_complete[x]) {
        this.animating_col_hints[x][0].set_state(3);
      }
    }

    for (y = 0; y < this.size_y; y++) {
      row_became_complete = this.hints_row_complete[y];
      this.hints_row_complete[y] = true;
      for (x = 0; x < this.size_x; x++) {
        if (this.solution[y][x] == 1 && this.current_state[y][x] != 1) {
          this.hints_row_complete[y] = false;
        }
      }
      if (row_became_complete != this.hints_row_complete[y]) {
        this.animating_row_hints[y][0].set_state(3);
      }
    }

    // if (this.complete && this.complete_this_frame) {
    //   this.complete_this_frame = false;
    //   this.create_animating_grid();
    // }

    // for (x = 0; x < this.animating_grid_rows.length; x++) {
    //   if (this.animating_grid_rows[x][1] <= this.age) {
    //     this.animating_grid_rows[x][0].update();
    //   }
    // }
    // for (x = 0; x < this.animating_grid_cols.length; x++) {
    //   if (this.animating_grid_cols[x][1] <= this.age) {
    //     this.animating_grid_cols[x][0].update();
    //   }
    // }

    // Update ahimating hits.
    for (x = 0; x < this.animating_col_hints.length; x++) {
      if (this.age == this.animating_col_hints[x][1]) {
        this.animating_col_hints[x][0].set_state(1);
      }
      this.animating_col_hints[x][0].position_offset = this.position_offset;
      this.animating_col_hints[x][0].update();
    }
    for (x = 0; x < this.animating_row_hints.length; x++) {
      if (this.age == this.animating_row_hints[x][1]) {
        this.animating_row_hints[x][0].set_state(1);
      }
      this.animating_row_hints[x][0].position_offset = this.position_offset;
      this.animating_row_hints[x][0].update();
    }

    // Update animating grid
    this.default_grid.update();

    this.age++;
  }

  // Register a click at a position.
  cursor_position(mouse_position) {
    var cursor_at_cell = [-1, -1];
    if (mouse_position[0] > this.position[0] + this.position_offset[0] + this.hints_row_length * this.tile_size) {
      if (
        mouse_position[0] <
        this.position[0] +
          this.position_offset[0] +
          this.hints_row_length * this.tile_size +
          this.size_x * this.tile_size
      ) {
        var x;
        for (x = 0; x < this.size_x; x++) {
          // Note: In python, we converted cursor_at_cell to an int.  JS has only one number type.  Will this cause issues?
          cursor_at_cell[0] = Math.floor(
            (mouse_position[0] - this.position[0] - this.position_offset[0] - this.hints_row_length * this.tile_size) /
              this.tile_size
          );
        }
      }
    }

    if (mouse_position[1] > this.position[1] + this.position_offset[1] + this.hints_col_length * this.tile_size) {
      if (
        mouse_position[1] <
        this.position[1] +
          this.position_offset[1] +
          this.hints_col_length * this.tile_size +
          this.size_y * this.tile_size
      ) {
        for (x = 0; x < this.size_y; x++) {
          cursor_at_cell[1] = Math.floor(
            (mouse_position[1] - this.position[1] - this.position_offset[1] - this.hints_col_length * this.tile_size) /
              this.tile_size
          );
        }
      }
    }
    return cursor_at_cell;
  }

  // Handle a click on a cell, handles left and right click (mouse_button is 0 or 1 for left or right click respectively)
  // click_on_cell(click_position, mouse_button) {
  //   if (mouse_button === 0) {
  //     console.log("We left clicked on the cell", click_position);
  //   }
  //   if (mouse_button === 1) {
  //     console.log("We right clicked on the cell", click_position);
  //   }
  // }

  // This function takes the board solution and rebuilds the other board properties from that.
  // It will blow away the player's solution progress (so don't use after the player starts solving!)
  update_hints() {
    var x = 0;
    var y = 0;
    var complete_last_frame = false;

    // Set board size based on the currently set solution.
    this.size_x = this.solution[0].length;
    this.size_y = this.solution.length;

    // Check for a bad board.
    for (x = 0; x < this.solution; x++) {
      if (this.solution[x].length != this.size_x) {
        console.log("We're got a bad board.");
        return false;
      }
    }

    // Create a blank array for the current state and secret solution state.
    this.current_state = [];
    var row = [];
    for (x = 0; x < this.size_y; x++) {
      row = [];
      for (y = 0; y < this.size_x; y++) {
        row.push(0);
      }
      this.current_state.push(row);
    }

    this.secret_state = [];
    for (x = 0; x < this.size_y; x++) {
      row = [];
      for (y = 0; y < this.size_x; y++) {
        row.push(0);
      }
      this.secret_state.push(row);
    }

    // Calculate row and column hints.
    this.hints_row = [];
    for (y = 0; y < this.size_y; y++) {
      this.hints_row.push(this.calculate_row_hints(this.solution[y]));
    }

    this.find_hints_row_length();

    this.hints_col = [];
    var temp_list = [];
    for (x = 0; x < this.size_x; x++) {
      temp_list = [];
      for (y = 0; y < this.size_y; y++) {
        temp_list.push(this.solution[y][x]);
      }
      this.hints_col.push(this.calculate_row_hints(temp_list));
    }

    this.find_hints_col_length();

    // Set complete state
    this.complete = this.is_complete();  
  }

  //This function takes a row (which may have been derived from a column) and calculates the hints for that row.
  calculate_row_hints(row) {
    var hints = [];
    var block_starts = [];
    var x;

    // Check for empty rows.
    if (row.length <= 0) {
      console.log("Cannot calculate hints for an empty row.");
      return false;
    }

    // Check to see if we have an empty (but valid) row.
    var empty_row = true;
    for (x = 0; x < row.length; x++) {
      if (row[x] != 0) {
        empty_row = false;
      }
    }
    if (empty_row) {
      return [0];
    }

    // Find the start of each contiguous block.
    for (x = 0; x < row.length; x++) {
      if (x == 0 && row[0] == 1) {
        block_starts.push(x);
      } else if (row[x - 1] == 0 && row[x] == 1) {
        block_starts.push(x);
      }
    }

    // For each block start, find the end and append it to our hints list.
    var end_search_position = 0;
    for (x = 0; x < block_starts.length; x++) {
      end_search_position = block_starts[x] + 1;
      while (end_search_position >= 0) {
        if (end_search_position >= row.length) {
          hints.push(end_search_position - block_starts[x]);
          end_search_position = -1;
        } else if (row[end_search_position - 1] == 1 && row[end_search_position] == 0) {
          hints.push(end_search_position - block_starts[x]);
          end_search_position = -1;
        } else {
          end_search_position += 1;
        }
      }
    }

    return hints;
  }

  random_board_method_1(size_x, size_y) {
    var loud = 0;

    var new_board = [];
    var temp_row;
    var rando;
    var x = 0;
    var y = 0;

    for (y = 0; y < size_y; y++) {
      temp_row = [];
      for (x = 0; x < size_x; x++) {
        rando = randint(1, 100);
        if (rando <= 60) {
          temp_row.push(1);
        } else {
          temp_row.push(0);
        }
      }
      new_board.push(temp_row);
    }

    if (loud >= 1) {
      console.log("New board:");
      console.log(new_board);
    }
    return new_board;
  }

  // Todo:  The plan for creating a random board is this:
  // 1: Select a number of stamps to use.  This will probably be near a common average.
  // 2: Select that many stamps from the stamp library (probably selecting stamps from a size class based on board size).
  // 3: Select some random number (about half) of the stamps to be negative.
  // 4: Stamp them stamps.
  // 5: Normalize the number of of filled/unfilled cells.
  // 6: Line-ify each edge.  Each edge has a 33% chance of getting edge-ified.  Each edge has a number of cells filled in
  //    by between 1/4 and 3/4 of its length.
  // 7: Normalize the number of filled/unfilled cells again.
  // Normalizing might use a crawler, where we go cell to cell in a random direction and fill (ur unfill, if needed).
  random_board_method_2(size_x, size_y) {
    var loud = 0;

    // Twiddle me:
    var polarity_ratio = 1;
    var static_count = 10;
    var crawler_life = 8;
    var crawler_count = 3;
    var fix_full_empty_row = 80; // (i.e. 80%)
    var fix_near_full_empty_row = 40; // (i.e. 40%)

    // Please don't twiddle me.
    var new_board = [];
    var temp_row;
    var rando;
    var x = 0;
    var y = 0;
    var stamp_x = 0;
    var stamp_y = 0;

    var board_stamps = [
      [[1, 1, 1], [1, 1, 1], [1, 1, 1]],

      [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],

      [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],

      [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],

      [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],

      [[1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1]],

      [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],

      [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1]],

      [[1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1]],

      [
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1]
      ],

      [
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1]
      ]
    ];

    // 0: Create a blank board.
    for (y = 0; y < size_y; y++) {
      temp_row = [];
      for (x = 0; x < size_x; x++) {
        temp_row.push(0);
      }
      new_board.push(temp_row);
    }

    if (loud >= 1) {
      console.log("Our method2 blank board");
      console.log(new_board);
    }

    // 1: Select a number of stamps to use.  This will probably be near a common average.
    // We are (mostly arbitrarily) using a distribution of 3/5/13/5/3 for 3/4/5/6/7 stamps respectively.

    var number_of_stamps = randint(1, 29);
    if (number_of_stamps <= 3) {
      number_of_stamps = 6;
    } else if (number_of_stamps <= 8) {
      number_of_stamps = 8;
    } else if (number_of_stamps <= 21) {
      number_of_stamps = 10;
    } else if (number_of_stamps <= 26) {
      number_of_stamps = 12;
    } else {
      number_of_stamps = 14;
    }

    // First stamp is always positive, every other stamp is 50/50.
    var stamp_in_use = 0;
    var stamp_position = [0, 0];
    var polarity = 1;
    for (x = 0; x < number_of_stamps; x++) {
      // Pick a stamp:
      stamp_in_use = board_stamps[randint(0, board_stamps.length - 1)];
      // Position that stamp.
      stamp_position[0] = randint(0, size_x - stamp_in_use[0].length);
      stamp_position[1] = randint(0, size_y - stamp_in_use.length);
      if (loud >= 1) {
        console.log("Stamp position is", stamp_position.slice(0));
        console.log("Stamp in use is", stamp_in_use);
      }
      // Choose polarity (Mostly positive)
      // '0's in stamps never change the board regardless of polarity.
      polarity = 1;
      if (x != 0) {
        polarity = randint(0, polarity_ratio);
        if (polarity > 0) {
          polarity = 1;
        }
      }
      // Stamp that shit.
      for (stamp_y = 0; stamp_y < stamp_in_use.length; stamp_y++) {
        for (stamp_x = 0; stamp_x < stamp_in_use[0].length; stamp_x++) {
          if (stamp_in_use[stamp_y][stamp_x] == 1) {
            new_board[stamp_position[1] + stamp_y][stamp_position[0] + stamp_x] = polarity;
          }
        }
      }
    }

    // Line-ify each edge.  Each edge has a 33% chance of getting edge-ified.
    // Each edge has a number of cells filled in by between 1/4 and 3/4 of its length.

    var edge_fill_start = Math.floor(size_x / 4);
    var edge_fill_end = Math.ceil(size_x * (3 / 4));

    // Top edge.
    if (randint(0, 2) == 0) {
      var edge_length = randint(edge_fill_start, edge_fill_end);
      var edge_offset = randint(0, size_x - edge_length);

      for (x = 0; x < edge_length; x++) {
        new_board[0][edge_offset + x] = 1;
      }
    }

    // Bottom edge.
    if (randint(0, 2) == 0) {
      var edge_length = randint(edge_fill_start, edge_fill_end);
      var edge_offset = randint(0, size_x - edge_length);

      for (x = 0; x < edge_length; x++) {
        new_board[size_y - 1][edge_offset + x] = 1;
      }
    }

    // Left edge.
    if (randint(0, 2) == 0) {
      var edge_length = randint(edge_fill_start, edge_fill_end);
      var edge_offset = randint(0, size_x - edge_length);

      for (x = 0; x < edge_length; x++) {
        new_board[x + edge_offset][0] = 1;
      }
    }

    // right edge.
    if (randint(0, 2) == 0) {
      var edge_length = randint(edge_fill_start, edge_fill_end);
      var edge_offset = randint(0, size_x - edge_length);

      for (x = 0; x < edge_length; x++) {
        new_board[x + edge_offset][size_x - 1] = 1;
      }
    }

    // Do some crawlers.
    // These start at a random position and move around the board swapping tiles.
    for (x = 0; x < crawler_count; x++) {
      var crawler_pos_x = randint(0, size_x - 1);
      var crawler_pos_y = randint(0, size_y - 1);
      this.do_a_crawler(crawler_pos_x, crawler_pos_y, crawler_life, new_board);
    }

    // Add some noise.  Twiddle static_count (above).
    for (x = 0; x < static_count; x++) {
      if (new_board[randint(0, size_y - 1)][randint(0, size_x - 1)] == 1) {
        new_board[randint(0, size_y - 1)][randint(0, size_x - 1)] = 0;
      } else {
        new_board[randint(0, size_y - 1)][randint(0, size_x - 1)] = 1;
      }
    }

    // Check for empty/full lines.
    var row_sum = 0;
    // rows first.
    for (y = 0; y < size_y; y++) {
      row_sum = sum_array(new_board[y]);
      if (row_sum == size_x || row_sum == 0) {
        if (randint(1, 100) < fix_full_empty_row) {
          console.log("Doin' a crawler at row", y);
          this.do_a_crawler(randint(0, size_x - 1), y, crawler_life, new_board);
        }
      } else if (row_sum == size_x - 1) {
        if (randint(1, 100) < fix_near_full_empty_row) {
          console.log("Doin' a crawler at not quite full row", y);
          this.do_a_crawler(randint(0, size_x - 1), y, crawler_life, new_board);
        }
      }
    }

    // columns next.
    for (x = 0; x < size_x; x++) {
      row_sum = 0;
      for (y = 0; y < size_y; y++) {
        row_sum += new_board[y][x];
      }
      if (row_sum == size_y || row_sum == 0) {
        if (randint(1, 100) < fix_full_empty_row) {
          console.log("Doin' a crawler at column", x);
          this.do_a_crawler(x, randint(0, size_y - 1), crawler_life, new_board);
        }
      } else if (row_sum == size_y - 1) {
        if (randint(1, 100) < fix_near_full_empty_row) {
          console.log("Doin' a crawler at not quite full column", x);
          this.do_a_crawler(x, randint(0, size_y - 1), crawler_life, new_board);
        }
      }
    }

    // Report
    if (loud >= 1) {
      console.log("New board:");
      for (x = 0; x < new_board.length; x++) {
        console.log(new_board[x]);
      }
    }
    return new_board;
  }

  do_a_crawler(x_pos, y_pos, life, board) {
    var direction = 0; // 1/2/3/4 for north/east/south/west.
    var x;

    if (life < 3) {
      console.log("Warning!  We expect crawlers to have a median life of at least 3!");
    }
    var life = randint(life - 2, life + 2);

    for (x = 0; x < life; x++) {
      if (board[y_pos][x_pos] == 0) {
        board[y_pos][x_pos] = 1;
      } else {
        board[x_pos][x_pos] = 0;
      }

      direction = randint(1, 4);
      if (direction == 1 && y_pos <= 0) {
        direction = 3;
      } else if (direction == 2 && x_pos >= board.length - 1) {
        direction = 4;
      } else if (direction == 3 && y_pos >= board[0].length - 1) {
        direction = 1;
      } else if (direction == 4 && x_pos == 0) {
        direction = 2;
      }

      if (direction == 1) {
        y_pos--;
      } else if (direction == 2) {
        x_pos++;
      } else if (direction == 3) {
        y_pos++;
      } else {
        x_pos--;
      }
    }
  }

  jiggle(amplitude) {
    var pi = Math.PI;
    var angle1 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    var angle2 = Math.floor(Math.random() * 360) * ((2 * pi) / 360);
    this.position_offset[0] = Math.cos(angle1) * amplitude;
    this.position_offset[1] = Math.sin(angle1) * amplitude;
    this.velocity[0] = Math.cos(angle2) * amplitude;
    this.velocity[1] = Math.sin(angle2) * amplitude;
  }

  is_complete() {
    var x = 0;
    var y = 0;
    var complete = true;

    this.complete_last_check = this.complete;

    for (y = 0; y < this.size_y; y++) {
      for (x = 0; x < this.size_x; x++) {
        if (this.solution[x][y] == 1 && this.current_state[x][y] != 1) {
          complete = false;
        }
      }
    }
    if (complete) {
      this.complete = true;
      for (y = 0; y < this.size_y; y++) {
        for (x = 0; x < this.size_x; x++) {
          if (this.current_state[y][x] == 0) {
            this.current_state[y][x] = -1;
          }
        }
      }
    }
    if (this.complete && !this.complete_last_check) {
      this.default_grid.set_state(3);
    }
  }

  is_secret_complete() {
    var x = 0;
    var y = 0;
    for (y = 0; y < this.size_y; y++) {
      for (x = 0; x < this.size_x; x++) {
        if (this.solution[x][y] == 1 && this.secret_state[x][y] != 1) {
          return false;
        } else if (this.solution[x][y] == 0 && this.secret_state[x][y] != -1) {
          return false;
        }
      }
    }
    return true;
  }

  // Take two at the find starts function.
  // 1: For each hint, starting from the right, find the minimum space (right_space) taken up by that hing and all hints to the right.
  // 2: If that value is less than the total space in the row to the right of the start of the current hint,
  // scoot this hint right by one, and scoot all hints to the right as far left as possible.
  // row, hints,        starts
  //          "4,   [3],    [0]"
  find_starts(row, hints, starts) {
    var x = 0;
    var y = 0;

    var right_space = 0;
    var scoot = 0;

    if (hints.length == 1) {
      if (hints[0] + starts[0] < row) {
        starts[0]++;
        return starts;
      }
    } else {
      for (x = hints.length - 1; x >= 0; x--) {
        right_space = sum_array(hints.slice(x, hints.length));
        right_space += hints.slice(x, hints.length).length - 1;
        if (starts[x] + right_space < row) {
          starts[x]++;
          scoot = starts[x] + hints[x] + 1;
          for (y = x + 1; y < hints.length; y++) {
            starts[y] = scoot;
            scoot += hints[y] + 1;
          }
          return starts;
        }
      }
    }
    return false;
  }

  // Steps:
  // 1: Our inputs are the list of hints (from the board class) and the known values on the current line.
  // 2: We arrange our hints on the current line in every way possible.
  // 3: We check each arrangement against our known hints, and build a list of which lines work.
  // 4: We throw out all non-working lines.
  // 5: We find all squares that are always filled in working lines, and mark them as filled in the output.
  // 6: We find all squares that are always empty in working lines, and mark them as filled in the output.
  // 7: Return output
  solve_row(row_index) {
    // Loud is extra info.  1 = some extra, 2 = lots of extra.
    var loud = 0;
    var solution_row = [];
    var solution_hints;
    var x;
    var y;

    // Find which row to operate on based on row_index.  0 is the first column, and we end with the bottom row.
    if (row_index > this.size_x + this.size_y || row_index < 0) {
      console.log("Bad row index input to solve_row.");
      return false;
    } else {
      solution_row = [];
      if (row_index < this.size_x) {
        for (x = 0; x < this.size_y; x++) {
          solution_row.push(this.secret_state[x][row_index]);
        }
        solution_hints = this.hints_col[row_index];
      } else {
        for (x = 0; x < this.size_x; x++) {
          solution_row.push(this.secret_state[row_index - this.size_y][x]);
        }
        solution_hints = this.hints_row[row_index - this.size_x];
      }
    }

    // Here we try to save time by skipping solved rows.
    var solved = 1;
    for (x = 0; x < solution_row.length; x++) {
      if (solution_row[x] == 0) {
        solved = 0;
      }
    }
    if (solved == 1) {
      if (loud >= 1) {
        console.log("This row is already solved!");
        console.log("Skiping further checks.");
      }
      return solution_row;
    }

    // Here we save a little more time by checking if our hint is '0'.  Our algorithm works without this check (strangely).
    if (solution_hints[0] == 0) {
      if (loud >= 1) {
        console.log("This row is empty!");
      }
      for (x = 0; x < solution_row.length; x++) {
        solution_row[x] = -1;
      }
      if (loud >= 1) {
        console.log(solution_row);
      }
      return solution_row;
    }

    // Bulk and defect aren't used except to calculate permutations, which isn't really necessary (but interesting to know)
    var bulk = 0;
    var defect = 0;
    for (x = 0; x < solution_hints.length; x++) {
      bulk += solution_hints[x];
    }
    bulk += solution_hints.length - 1;
    defect = solution_row.length - bulk;

    // Iterations to test
    var n = solution_hints.length + defect;
    var r = solution_row.length - bulk;
    var permutations = 0;

    if (solution_hints[0] == 0) {
      if (loud >= 1) {
        console.log("solution_hints[0] = 0");
        console.log("bulk = ", bulk);
        console.log("defect = ", defect);
        console.log("n = ", n);
        console.log("r = ", r);
      }
    }
    if (loud >= 2) {
      console.log("Calculating: ", n, "! over (", n, " - ", r, ") times", r, "!");
    }
    permutations = factorial(n) / (factorial(n - r) * factorial(r));
    if (!Number.isInteger(permutations)) {
      console.log("I guess we needed to integerize 'permutations' variable...?");
    }
    // permutations = int(permutations) // Not sure why we need this.  Check here for errors...?
    if (loud >= 1) {
      console.log("This row has", permutations, "permutations.");
    }

    // First arrangement
    var starts = [];
    // starts_length is the length of the chains placed so far,
    // i.e. how far along we need to place the next start.
    // solution_hints is simply a reference to the hints for our row or column.
    var starts_length = 0;
    for (x = 0; x < solution_hints.length; x++) {
      if (x == 0) {
        starts.push(0);
      } else {
        starts_length = starts[x - 1] + solution_hints[x - 1] + 1;
        starts.push(starts_length);
      }
    }

    var all_starts = [];
    var all_starts_tests = [];
    var test_row = [];
    var hint_start = 0;
    var hint_end = 0;

    for (x = 0; x < solution_row.length; x++) {
      test_row.push(-1);
    }

    // This while loop finds all starts, and throws out the ones that conflict with solution_row.  The remainder are put in the list of all_starts.
    var temp_counter = 0;
    while (starts !== false) {
      temp_counter++;

      // Prepare test_row, which we will compare to solution_row.  If test_row passes, it goes in all_starts.
      for (x = 0; x < test_row.length; x++) {
        test_row[x] = -1;
      }
      for (x = 0; x < solution_hints.length; x++) {
        hint_start = starts[x];
        hint_end = starts[x] + solution_hints[x];
        for (y = hint_start; y < hint_end; y++) {
          test_row[y] = 1;
        }
      }

      // Compare test_row to what we know about solution_row

      var match = 1;
      for (x = 0; x < test_row.length; x++) {
        if (solution_row[x] != 0 && solution_row[x] != test_row[x]) {
          if (loud >= 2) {
            console.log("Throwing out", starts, "due to conflict.");
          }
          match = 0;
        }
      }
      if (match == 1) {
        all_starts.push(starts.slice(0));
        all_starts_tests.push(test_row.slice(0));
      }
      starts = this.find_starts(solution_row.length, solution_hints, starts.slice(0));
    }

    if (loud >= 2) {
      console.log("Possible arrangements:");
      for (x = 0; x < all_starts_tests.length; x++) {
        console.log(all_starts[x]);
        console.log(all_starts_tests[x]);
      }
    }

    // Now we look at our remaining starts and find if they ALL have a +1 or -1 in a particular position.
    // We do this by adding everything (+1s and -1s).  If we find maximal numbers, we keep them.
    var sum_row = [];
    var summand = 0;
    for (x = 0; x < solution_row.length; x++) {
      summand = 0;
      for (y = 0; y < all_starts_tests.length; y++) {
        summand = summand + all_starts_tests[y][x];
      }
      sum_row.push(summand);
    }

    for (x = 0; x < sum_row.length; x++) {
      if (sum_row[x] == all_starts_tests.length) {
        solution_row[x] = 1;
      }
      if (sum_row[x] == all_starts_tests.length * -1) {
        solution_row[x] = -1;
      }
    }

    if (loud >= 1) {
      console.log("Final Row:");
      console.log(solution_row);
    }

    return solution_row;
  }

  solve_board() {
    var loud = 0;
    var x = 0;
    var y = 0;

    if (loud >= 1) {
      console.log("Solving this board:");
      for (x = 0; x < this.size_y; x++) {
        console.log(this.solution[x]);
      }
    }

    if (this.is_secret_complete()) {
      if (loud >= 1) {
        console.log("Board already complete");
        for (x = 0; x < this.size_y; x++) {
          console.log(this.secret_state[x]);
        }
      }
      return true;
    }

    var solved_squares_prev = 0;
    for (y = 0; y < this.size_y; y++) {
      for (x = 0; x < this.size_x; x++) {
        if (this.secret_state[y][x] != 0) {
          solved_squares_prev += 1;
        }
      }
    }

    var progress = true;
    var solved_squares = 0;
    var solved_column;

    while (progress) {
      solved_squares = 0;

      for (x = 0; x < this.size_x + this.size_y; x++) {
        if (x < this.size_x) {
          solved_column = this.solve_row(x);
          for (y = 0; y < this.size_y; y++) {
            this.secret_state[y][x] = solved_column[y];
          }
        } else {
          this.secret_state[x - this.size_x] = this.solve_row(x);
        }
      }

      for (y = 0; y < this.size_y; y++) {
        for (x = 0; x < this.size_x; x++) {
          if (this.secret_state[y][x] != 0) {
            solved_squares++;
          }
        }
      }

      if (solved_squares == solved_squares_prev) {
        progress = false;
      }
      solved_squares_prev = solved_squares;
    }

    if (this.is_secret_complete()) {
      if (loud >= 1) {
        console.log("Board complete:");
        for (x = 0; x < this.size_y; x++) {
          console.log(this.secret_state[x]);
        }
      }
      return true;
    } else {
      if (loud >= 1) {
        console.log("Board could not be completed.  Partial solution:");
        for (x = 0; x < this.size_y; x++) {
          console.log(this.secret_state[x]);
        }
      }
      return false;
    }
  }

  draw_board(context) {
    // Common values we don't want to keep calculating:
    var total_position = [this.position[0] + this.position_offset[0], this.position[1] + this.position_offset[1]];
    var row_hints_pixels = this.hints_row_length * this.tile_size;
    var col_hints_pixels = this.hints_col_length * this.tile_size;

    var x = 0;
    var y = 0;
    var z = 0;
    var row = 0;
    var column = 0;
    var row_solved = true;
    var col_solved = true;
    var filled_u = false;
    var filled_d = false;
    var filled_l = false;
    var filled_r = false;
    var filled_ul = false;
    var filled_ur = false;
    var filled_dl = false;
    var filled_dr = false;
    var edge_u = false;
    var edge_d = false;
    var edge_l = false;
    var edge_r = false;

    // Draw the board itself.
    if (this.intro_state == 0) {
      // Don't draw until we're done with the countdown.
      for (row = 0; row < this.size_y; row++) {
        for (column = 0; column < this.size_x; column++) {
          // Draw unchecked cells
          if (this.current_state[row][column] == 0) {
            this.sprites_tiles.board_cell_blank.draw(
              context,
              total_position[0] + row_hints_pixels + column * this.tile_size,
              total_position[1] + col_hints_pixels + row * this.tile_size
            );
          } else if (this.current_state[row][column] <= -1) {
            // ///////////////////////////
            // This stuff checks the state around the cell in question.
            // ///////////////////////////
            filled_u = false;
            filled_d = false;
            filled_l = false;
            filled_r = false;
            filled_ul = false;
            filled_ur = false;
            filled_dl = false;
            filled_dr = false;
            edge_u = false;
            edge_d = false;
            edge_l = false;
            edge_r = false;
            if (row == 0) {
              edge_u = true;
            } else if (this.current_state[row - 1][column] >= 0) {
              filled_u = true;
            }
            if (row == this.size_y - 1) {
              edge_d = true;
            } else if (this.current_state[row + 1][column] >= 0) {
              filled_d = true;
            }
            if (column == 0) {
              edge_l = true;
            } else if (this.current_state[row][column - 1] >= 0) {
              filled_l = true;
            }
            if (column == this.size_x - 1) {
              edge_r = true;
            } else if (this.current_state[row][column + 1] >= 0) {
              filled_r = true;
            }
            if (!edge_u && !edge_l) {
              if (this.current_state[row - 1][column - 1] >= 0) {
                filled_ul = true;
              }
            }
            if (!edge_u && !edge_r) {
              if (this.current_state[row - 1][column + 1] >= 0) {
                filled_ur = true;
              }
            }
            if (!edge_d && !edge_l) {
              if (this.current_state[row + 1][column - 1] >= 0) {
                filled_dl = true;
              }
            }
            if (!edge_d && !edge_r) {
              if (this.current_state[row + 1][column + 1] >= 0) {
                filled_dr = true;
              }
            }
            // ////////////////////////
            // Now we draw the border IN the cell in question.
            // ////////////////////////
            if (filled_ul) {
              this.sprites_tiles.board_cross_corner_out_ul.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_ur) {
              this.sprites_tiles.board_cross_corner_out_ur.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size + 27,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_dl) {
              this.sprites_tiles.board_cross_corner_out_dl.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size + 27
              );
            }
            if (filled_dr) {
              this.sprites_tiles.board_cross_corner_out_dr.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size + 27,
                total_position[1] + col_hints_pixels + row * this.tile_size + 27
              );
            }
            if (filled_u) {
              this.sprites_tiles.board_cross_edge_up.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_d) {
              this.sprites_tiles.board_cross_edge_down.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size + 27
              );
            }
            if (filled_l) {
              this.sprites_tiles.board_cross_edge_left.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_r) {
              this.sprites_tiles.board_cross_edge_right.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size + 27,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_u && filled_l) {
              this.sprites_tiles.board_cross_corner_in_ul.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_u && filled_r) {
              this.sprites_tiles.board_cross_corner_in_ur.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size + 27,
                total_position[1] + col_hints_pixels + row * this.tile_size
              );
            }
            if (filled_d && filled_l) {
              this.sprites_tiles.board_cross_corner_in_dl.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size,
                total_position[1] + col_hints_pixels + row * this.tile_size + 27
              );
            }
            if (filled_d && filled_r) {
              this.sprites_tiles.board_cross_corner_in_dr.draw(
                context,
                total_position[0] + row_hints_pixels + column * this.tile_size + 27,
                total_position[1] + col_hints_pixels + row * this.tile_size + 27
              );
            }
          }
          if (this.current_state[row][column] == -2) {
            this.sprites_tiles.board_cell_wrong.draw(
              context,
              total_position[0] + row_hints_pixels + column * this.tile_size,
              total_position[1] + col_hints_pixels + row * this.tile_size
            );
          }
        }
      }
    }

    // Draw the border stuff around the outside of the boad.
    // Starting with the corners:
    // Top left
    if (this.current_state[0][0] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dr.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels - 5
      );
      this.sprites_tiles.board_cross_edge_down.draw(
        context,
        total_position[0] + row_hints_pixels,
        total_position[1] + col_hints_pixels - 5
      );
      this.sprites_tiles.board_cross_edge_right.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels
      );
    }
    if (this.current_state[0][0] < 0 && this.current_state[0][1] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dr.draw(
        context,
        total_position[0] + row_hints_pixels + this.tile_size - 5,
        total_position[1] + col_hints_pixels - 5
      );
    }
    if (this.current_state[0][0] < 0 && this.current_state[1][0] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dr.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels + this.tile_size - 5
      );
    }

    // Top right
    if (this.current_state[0][this.size_x - 1] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dl.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels - 5
      );
      this.sprites_tiles.board_cross_edge_down.draw(
        context,
        total_position[0] + row_hints_pixels + (this.size_x - 1) * this.tile_size,
        total_position[1] + col_hints_pixels - 5
      );
      this.sprites_tiles.board_cross_edge_left.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels
      );
    }
    if (this.current_state[0][this.size_x - 1] < 0 && this.current_state[0][this.size_x - 2] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dl.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size - this.tile_size,
        total_position[1] + col_hints_pixels - 5
      );
    }
    if (this.current_state[0][this.size_x - 1] < 0 && this.current_state[1][this.size_x - 1] >= 0) {
      this.sprites_tiles.board_cross_corner_out_dl.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels + this.tile_size - 5
      );
    }

    // Bottom left
    if (this.current_state[this.size_y - 1][0] >= 0) {
      this.sprites_tiles.board_cross_corner_out_ur.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
      this.sprites_tiles.board_cross_edge_up.draw(
        context,
        total_position[0] + row_hints_pixels,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
      this.sprites_tiles.board_cross_edge_right.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels + (this.size_y - 1) * this.tile_size
      );
    }
    if (this.current_state[this.size_y - 1][0] < 0 && this.current_state[this.size_y - 2][0] >= 0) {
      this.sprites_tiles.board_cross_corner_out_ur.draw(
        context,
        total_position[0] + row_hints_pixels - 5,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size - this.tile_size
      );
    }
    if (this.current_state[this.size_y - 1][0] < 0 && this.current_state[this.size_y - 1][1] >= 0) {
      this.sprites_tiles.board_cross_corner_out_ur.draw(
        context,
        total_position[0] + row_hints_pixels + this.tile_size - 5,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
    }

    // Bottom right
    if (this.current_state[this.size_y - 1][this.size_x - 1] >= 0) {
      this.sprites_tiles.board_cross_corner_out_ul.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
      this.sprites_tiles.board_cross_edge_up.draw(
        context,
        total_position[0] + row_hints_pixels + (this.size_x - 1) * this.tile_size,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
      this.sprites_tiles.board_cross_edge_left.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels + (this.size_y - 1) * this.tile_size
      );
    }
    if (
      this.current_state[this.size_y - 1][this.size_x - 1] < 0 &&
      this.current_state[this.size_y - 1][this.size_x - 2] >= 0
    ) {
      this.sprites_tiles.board_cross_corner_out_ul.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size - this.tile_size,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size
      );
    }
    if (
      this.current_state[this.size_y - 1][this.size_x - 1] < 0 &&
      this.current_state[this.size_y - 2][this.size_x - 1] >= 0
    ) {
      this.sprites_tiles.board_cross_corner_out_ul.draw(
        context,
        total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
        total_position[1] + col_hints_pixels + this.size_y * this.tile_size - this.tile_size
      );
    }

    // Top edge
    for (x = 1; x < this.size_x - 1; x++) {
      if (this.current_state[0][x - 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_dl.draw(
          context,
          total_position[0] + row_hints_pixels + x * this.tile_size,
          total_position[1] + col_hints_pixels - 5
        );
      }
      if (this.current_state[0][x + 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_dr.draw(
          context,
          total_position[0] + row_hints_pixels + (x + 1) * this.tile_size - 5,
          total_position[1] + col_hints_pixels - 5
        );
      }
      if (this.current_state[0][x] >= 0) {
        this.sprites_tiles.board_cross_edge_down.draw(
          context,
          total_position[0] + row_hints_pixels + x * this.tile_size,
          total_position[1] + col_hints_pixels - 5
        );
      }
    }

    // Bottom edge
    for (x = 1; x < this.size_x - 1; x++) {
      if (this.current_state[this.size_y - 1][x - 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_ul.draw(
          context,
          total_position[0] + row_hints_pixels + x * this.tile_size,
          total_position[1] + col_hints_pixels + this.size_y * this.tile_size
        );
      }
      if (this.current_state[this.size_y - 1][x + 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_ur.draw(
          context,
          total_position[0] + row_hints_pixels + (x + 1) * this.tile_size - 5,
          total_position[1] + col_hints_pixels + this.size_y * this.tile_size
        );
      }
      if (this.current_state[this.size_y - 1][x] >= 0) {
        this.sprites_tiles.board_cross_edge_up.draw(
          context,
          total_position[0] + row_hints_pixels + x * this.tile_size,
          total_position[1] + col_hints_pixels + this.size_y * this.tile_size
        );
      }
    }

    // Left edge
    for (y = 1; y < this.size_y - 1; y++) {
      if (this.current_state[y - 1][0] >= 0) {
        this.sprites_tiles.board_cross_corner_out_ur.draw(
          context,
          total_position[0] + row_hints_pixels - 5,
          total_position[1] + col_hints_pixels + y * this.tile_size
        );
      }
      if (this.current_state[y + 1][0] >= 0) {
        this.sprites_tiles.board_cross_corner_out_dr.draw(
          context,
          total_position[0] + row_hints_pixels - 5,
          total_position[1] + col_hints_pixels + (y + 1) * this.tile_size - 5
        );
      }
      if (this.current_state[y][0] >= 0) {
        this.sprites_tiles.board_cross_edge_right.draw(
          context,
          total_position[0] + row_hints_pixels - 5,
          total_position[1] + col_hints_pixels + y * this.tile_size
        );
      }
    }

    // Right edge
    for (y = 1; y < this.size_y - 1; y++) {
      if (this.current_state[y - 1][this.size_x - 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_ul.draw(
          context,
          total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
          total_position[1] + col_hints_pixels + y * this.tile_size
        );
      }
      if (this.current_state[y + 1][this.size_x - 1] >= 0) {
        this.sprites_tiles.board_cross_corner_out_dl.draw(
          context,
          total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
          total_position[1] + col_hints_pixels + (y + 1) * this.tile_size - 5
        );
      }
      if (this.current_state[y][this.size_x - 1] >= 0) {
        this.sprites_tiles.board_cross_edge_left.draw(
          context,
          total_position[0] + row_hints_pixels + this.size_x * this.tile_size,
          total_position[1] + col_hints_pixels + y * this.tile_size
        );
      }
    }

    // Draw animating filled cells here.
    for (x = 0; x < this.filled_cell_sprites.length; x++) {
      this.filled_cell_sprites[x][0].draw(
        context,
        total_position[0] + row_hints_pixels + this.filled_cell_sprites[x][1] * this.tile_size,
        total_position[1] + col_hints_pixels + this.filled_cell_sprites[x][2] * this.tile_size
      );
    }
    // Draw animating hints if they're older than their start age.
    // [hint index, sprite, start age]
    // We should also draw the row 'remainder' as it burns down.

    // remaining_tiles[1] is true for rows, false for columns.
    var remaining_tiles = [0, true];
    var checking_row = true;

    // for (x = 0; x < this.animating_hints.length; x++) {
    //   // For each row/col
    //   remaining_tiles = 0;
    //   for (y = 0; y < this.animating_hints[x].length; y++) {
    //     // For each cell in that row
    //     if (this.animating_hints[x][y][2] <= this.age) {
    //       // If enough time has passed
    //       if (this.animating_hints[x][y][0] < 15) {
    //         // If we're a row (not a column)
    //         remaining_tiles++;
    //         checking_row = true;
    //         this.animating_hints[x][y][1].draw(
    //           context,
    //           total_position[0] + y * this.tile_size,
    //           total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][y][0] - 1) * this.tile_size
    //         );
    //       } else {
    //         // We're a column, not a row.
    //         remaining_tiles++;
    //         checking_row = false;
    //         this.animating_hints[x][y][1].draw(
    //           context,
    //           total_position[0] + row_hints_pixels + (this.animating_hints[x][y][0] - 15) * this.tile_size,
    //           total_position[1] + y * this.tile_size
    //         );
    //       }
    //     }
    //   }

    //   if (checking_row) {
    //     remaining_tiles = this.hints_row_length - remaining_tiles;
    //   } else {
    //     remaining_tiles = this.hints_col_length - remaining_tiles;
    //   }

    //   if (checking_row) {
    //     if (remaining_tiles == 1) {
    //       // Draw only the single hint tile.
    //       this.sprites_tiles.board_row_hint_single.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - this.tile_size,
    //         total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //       );
    //     } else if (remaining_tiles == 2) {
    //       // Draw only the left and right cap tiles.
    //       this.sprites_tiles.board_row_hint_left.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - 2 * this.tile_size,
    //         total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //       );
    //       this.sprites_tiles.board_row_hint_right.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - this.tile_size,
    //         total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //       );
    //     } else if (remaining_tiles > 2) {
    //       // Draw the left and right caps, and some stuff in between.
    //       this.sprites_tiles.board_row_hint_left.draw(
    //         context,
    //         total_position[0] + (this.hints_row_length - remaining_tiles) * this.tile_size,
    //         total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //       );
    //       this.sprites_tiles.board_row_hint_right.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - this.tile_size,
    //         total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //       );
    //       for (z = 0; z < remaining_tiles - 2; z++) {
    //         this.sprites_tiles.board_row_hint_mid.draw(
    //           context,
    //           total_position[0] + (this.hints_row_length - remaining_tiles + 1 + z) * this.tile_size,
    //           total_position[1] + col_hints_pixels + (this.size_y - this.animating_hints[x][0][0] - 1) * this.tile_size
    //         );
    //       }
    //     }
    //   } else {
    //     if (remaining_tiles == 1) {
    //       // Draw only the single hint tile.
    //       this.sprites_tiles.board_col_hint_single.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //         total_position[1] + col_hints_pixels - this.tile_size
    //       );
    //     } else if (remaining_tiles == 2) {
    //       // Draw only the left and right cap tiles.
    //       this.sprites_tiles.board_col_hint_top.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //         total_position[1] + col_hints_pixels - 2 * this.tile_size
    //       );
    //       this.sprites_tiles.board_col_hint_bottom.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //         total_position[1] + col_hints_pixels - this.tile_size
    //       );
    //     } else if (remaining_tiles > 2) {
    //       // Draw the left and right caps, and some stuff in between.
    //       this.sprites_tiles.board_col_hint_top.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //         total_position[1] + (this.hints_col_length - remaining_tiles) * this.tile_size
    //       );
    //       this.sprites_tiles.board_col_hint_bottom.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //         total_position[1] + col_hints_pixels - this.tile_size
    //       );
    //       for (z = 0; z < remaining_tiles - 2; z++) {
    //         this.sprites_tiles.board_col_hint_mid.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + (this.animating_hints[x][0][0] - this.size_x) * this.tile_size,
    //           total_position[1] + (this.hints_col_length - remaining_tiles + 1 + z) * this.tile_size
    //         );
    //       }
    //     }
    //   }
    // }

    // Draw the animating row hints.  This happens even if intro_state > 0.
    for (x = 0; x < this.animating_row_hints.length; x++) {
      this.animating_row_hints[x][0].draw(context);
    }
    for (x = 0; x < this.animating_col_hints.length; x++) {
      this.animating_col_hints[x][0].draw(context);
    }

    // Draw row hints (numbers)
    if (this.intro_state == 0) {
      for (x = 0; x < this.hints_row.length; x++) {
        // Determine if row x has been solved...
        row_solved = true;
        for (y = 0; y < this.solution[x].length; y++) {
          if (this.solution[x][y] == 1 && this.current_state[x][y] != 1) {
            row_solved = false;
          }
        }
        // ...Draw the row hints if it hasn't.
        if (row_solved == false) {
          for (y = 0; y < this.hints_row[x].length; y++) {
            this.sprites_numbers[this.hints_row[x][y]].draw(
              context,
              total_position[0] +
                (this.hints_row_length - this.hints_row[x].length) * this.tile_size +
                y * this.tile_size,
              total_position[1] + col_hints_pixels + x * this.tile_size
            );
          }
        }
      }
    }

    // Draw column hints (numbers)
    if (this.intro_state == 0) {
      for (x = 0; x < this.hints_col.length; x++) {
        // Determine if column x has been solved...
        col_solved = true;
        for (y = 0; y < this.solution.length; y++) {
          if (this.solution[y][x] == 1 && this.current_state[y][x] != 1) {
            col_solved = false;
          }
        }
        // ...Draw the column hints if it hasn't.
        if (col_solved == false) {
          for (y = 0; y < this.hints_col[x].length; y++) {
            // console.log("Drawing", this.hints_col[x][y])
            this.sprites_numbers[this.hints_col[x][y]].draw(
              context,
              total_position[0] + row_hints_pixels + x * this.tile_size,
              total_position[1] +
                (this.hints_col_length - this.hints_col[x].length) * this.tile_size +
                y * this.tile_size
            );
          }
        }
      }
    }

    this.default_grid.draw(context);
    // // Drawing a 5-tile grid and border, but only until the board is complete, and we're not in intro state.
    // if (!this.complete && !this.failed && this.intro_state == 0) {
    //   // Even non-regulation size boards get a basic border (with corners).
    //   for (x = 0; x < this.size_x; x++) {
    //     this.sprites_board_grid.green_line_horiz.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + x * this.tile_size,
    //       total_position[1] + col_hints_pixels - 2
    //     );
    //     this.sprites_board_grid.green_line_horiz.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + x * this.tile_size,
    //       total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //     );
    //   }
    //   for (y = 0; y < this.size_y; y++) {
    //     this.sprites_board_grid.green_line_vertical.draw(
    //       context,
    //       total_position[0] + row_hints_pixels - 2,
    //       total_position[1] + col_hints_pixels + y * this.tile_size
    //     );
    //     this.sprites_board_grid.green_line_vertical.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //       total_position[1] + col_hints_pixels + y * this.tile_size
    //     );
    //   }

    //   this.sprites_board_grid.green_cap_top_left.draw(
    //     context,
    //     total_position[0] + row_hints_pixels - 2,
    //     total_position[1] + col_hints_pixels - 2
    //   );
    //   this.sprites_board_grid.green_cap_top_right.draw(
    //     context,
    //     total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //     total_position[1] + col_hints_pixels - 2
    //   );
    //   this.sprites_board_grid.green_cap_bottom_left.draw(
    //     context,
    //     total_position[0] + row_hints_pixels - 2,
    //     total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //   );
    //   this.sprites_board_grid.green_cap_bottom_right.draw(
    //     context,
    //     total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //     total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //   );

    //   // We're only doing the following if the board is 10x10, 15x15 or 20x20.

    //   // Draw vertical middle bars.
    //   if (this.regulation_size) {
    //     for (x = 0; x < this.size_x; x++) {
    //       this.sprites_board_grid.green_line_horiz.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * x,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       if (this.size_y >= 15) {
    //         this.sprites_board_grid.green_line_horiz.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * x,
    //           total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //         );
    //       }
    //       if (this.size_y >= 20) {
    //         this.sprites_board_grid.green_line_horiz.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * x,
    //           total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //         );
    //       }
    //     }

    //     // Draw horizontal middle bars.
    //     for (y = 0; y < this.size_y; y++) {
    //       this.sprites_board_grid.green_line_vertical.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * y
    //       );
    //       if (this.size_x >= 15) {
    //         this.sprites_board_grid.green_line_vertical.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //           total_position[1] + col_hints_pixels + this.tile_size * y
    //         );
    //       }
    //       if (this.size_x >= 20) {
    //         this.sprites_board_grid.green_line_vertical.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //           total_position[1] + col_hints_pixels + this.tile_size * y
    //         );
    //       }
    //     }

    //     // Draw intersections.
    //     // Top and bottom Ts.
    //     this.sprites_board_grid.green_cap_top_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + 5 * this.tile_size - 2,
    //       total_position[1] + col_hints_pixels - 2
    //     );
    //     this.sprites_board_grid.green_cap_bottom_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + 5 * this.tile_size - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //     );
    //     if (this.size_x >= 15) {
    //       this.sprites_board_grid.green_cap_top_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 10 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels - 2
    //       );
    //       this.sprites_board_grid.green_cap_bottom_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 10 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //       );
    //     }
    //     if (this.size_x >= 20) {
    //       this.sprites_board_grid.green_cap_top_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 15 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels - 2
    //       );
    //       this.sprites_board_grid.green_cap_bottom_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 15 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //       );
    //     }
    //     // Left and right Ts
    //     this.sprites_board_grid.green_cap_left_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     this.sprites_board_grid.green_cap_right_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     if (this.size_y >= 15) {
    //       this.sprites_board_grid.green_cap_left_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.green_cap_right_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //     }
    //     if (this.size_y >= 20) {
    //       this.sprites_board_grid.green_cap_left_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.green_cap_right_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //     }
    //     this.sprites_board_grid.green_cap_center.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     if (this.size_x >= 15) {
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //     }
    //     if (this.size_x >= 20) {
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.green_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //     }
    //   }
    // }

    // if (!this.complete && this.failed) {
    //   // Even non-regulation size boards get a basic border (with corners).
    //   for (x = 0; x < this.size_x; x++) {
    //     this.sprites_board_grid.red_line_horiz.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + x * this.tile_size,
    //       total_position[1] + col_hints_pixels - 2
    //     );
    //     this.sprites_board_grid.red_line_horiz.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + x * this.tile_size,
    //       total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //     );
    //   }
    //   for (y = 0; y < this.size_y; y++) {
    //     this.sprites_board_grid.red_line_vertical.draw(
    //       context,
    //       total_position[0] + row_hints_pixels - 2,
    //       total_position[1] + col_hints_pixels + y * this.tile_size
    //     );
    //     this.sprites_board_grid.red_line_vertical.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //       total_position[1] + col_hints_pixels + y * this.tile_size
    //     );
    //   }

    //   this.sprites_board_grid.red_cap_top_left.draw(
    //     context,
    //     total_position[0] + row_hints_pixels - 2,
    //     total_position[1] + col_hints_pixels - 2
    //   );
    //   this.sprites_board_grid.red_cap_top_right.draw(
    //     context,
    //     total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //     total_position[1] + col_hints_pixels - 2
    //   );
    //   this.sprites_board_grid.red_cap_bottom_left.draw(
    //     context,
    //     total_position[0] + row_hints_pixels - 2,
    //     total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //   );
    //   this.sprites_board_grid.red_cap_bottom_right.draw(
    //     context,
    //     total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //     total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //   );

    //   // Draw vertical middle bars.
    //   if (this.regulation_size) {
    //     for (x = 0; x < this.size_x; x++) {
    //       this.sprites_board_grid.red_line_horiz.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * x,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       if (this.size_y >= 15) {
    //         this.sprites_board_grid.red_line_horiz.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * x,
    //           total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //         );
    //       }
    //       if (this.size_y >= 20) {
    //         this.sprites_board_grid.red_line_horiz.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * x,
    //           total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //         );
    //       }
    //     }

    //     // Draw horizontal middle bars.
    //     for (y = 0; y < this.size_y; y++) {
    //       this.sprites_board_grid.red_line_vertical.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * y
    //       );
    //       if (this.size_x >= 15) {
    //         this.sprites_board_grid.red_line_vertical.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //           total_position[1] + col_hints_pixels + this.tile_size * y
    //         );
    //       }
    //       if (this.size_x >= 20) {
    //         this.sprites_board_grid.red_line_vertical.draw(
    //           context,
    //           total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //           total_position[1] + col_hints_pixels + this.tile_size * y
    //         );
    //       }
    //     }

    //     // Draw intersections.
    //     // Top and bottom Ts.
    //     this.sprites_board_grid.red_cap_top_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + 5 * this.tile_size - 2,
    //       total_position[1] + col_hints_pixels - 2
    //     );
    //     this.sprites_board_grid.red_cap_bottom_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + 5 * this.tile_size - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //     );
    //     if (this.size_x >= 15) {
    //       this.sprites_board_grid.red_cap_top_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 10 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels - 2
    //       );
    //       this.sprites_board_grid.red_cap_bottom_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 10 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //       );
    //     }
    //     if (this.size_x >= 20) {
    //       this.sprites_board_grid.redcap_top_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 15 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels - 2
    //       );
    //       this.sprites_board_grid.red_cap_bottom_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + 15 * this.tile_size - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * this.size_y - 2
    //       );
    //     }
    //     // Left and right Ts
    //     this.sprites_board_grid.red_cap_left_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     this.sprites_board_grid.red_cap_right_t.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     if (this.size_y >= 15) {
    //       this.sprites_board_grid.red_cap_left_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.red_cap_right_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //     }
    //     if (this.size_y >= 20) {
    //       this.sprites_board_grid.red_cap_left_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.red_cap_right_t.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * this.size_x - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //     }
    //     this.sprites_board_grid.red_cap_center.draw(
    //       context,
    //       total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //       total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //     );
    //     if (this.size_x >= 15) {
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //     }
    //     if (this.size_x >= 20) {
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 5 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 10 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 5 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 10 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //       this.sprites_board_grid.red_cap_center.draw(
    //         context,
    //         total_position[0] + row_hints_pixels + this.tile_size * 15 - 2,
    //         total_position[1] + col_hints_pixels + this.tile_size * 15 - 2
    //       );
    //     }
    //   }
    // }

    // // Draw animating grid
    // var row_number;
    // var col_number;
    // if (!this.regulation_size) {
    //   row_number = 2;
    //   col_number = 2;
    // } else {
    //   row_number = 1 + Math.floor(this.size_x / 5);
    //   col_number = 1 + Math.floor(this.size_y / 5);
    // }

    // for (x = 0; x < this.animating_grid_rows.length; x++) {
    //   this.animating_grid_rows[x][0].draw(
    //     context,
    //     total_position[0] + row_hints_pixels + Math.floor(x / row_number) * this.tile_size,
    //     total_position[1] + col_hints_pixels + (x % row_number) * 5 * this.tile_size - 2
    //   );
    // }
    // for (x = 0; x < this.animating_grid_cols.length; x++) {
    //   this.animating_grid_cols[x][0].draw(
    //     context,
    //     total_position[0] + row_hints_pixels + (x % col_number) * 5 * this.tile_size - 2,
    //     total_position[1] + col_hints_pixels + Math.floor(x / col_number) * this.tile_size
    //   );
    // }
    // for (x = 0; x < this.animating_grid_cols.length; x++) {
    //   if (this.animating_grid_cols[x][1] <= this.age) {
    //     console.log("Drawing col dude");
    //     this.animating_grid_cols[x][0].draw(
    //       context,
    //       total_position[0] + row_hints_pixels + ((x % col_number) * 5 * this.tile_size) - 2,
    //       total_position[1] + col_hints_pixels + (Math.floor(x / col_number) * this.tile_size)
    //     );
    //   }
    // }

    // Draw countdown during intro.
    // We have special graphics if the board is regulation size (5, 10, 15, 20x).
    // Otherwise we just use sthe 5x art and don't bother to pad around it.
    if (this.regulation_size && this.size_x == 5) {
      if (this.intro_state == 3) {
        this.sprites_board_countdown.count_5x_3.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 2) {
        this.sprites_board_countdown.count_5x_2.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 1) {
        this.sprites_board_countdown.count_5x_1.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      }
    } else if (this.regulation_size && this.size_x == 10) {
      if (this.intro_state == 3) {
        this.sprites_board_countdown.count_10x_3.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 2) {
        this.sprites_board_countdown.count_10x_2.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 1) {
        this.sprites_board_countdown.count_10x_1.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      }
    } else if (this.regulation_size && this.size_x == 15) {
      if (this.intro_state == 3) {
        this.sprites_board_countdown.count_15x_3.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 2) {
        this.sprites_board_countdown.count_15x_2.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 1) {
        this.sprites_board_countdown.count_15x_1.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      }
    } else if (this.regulation_size && this.size_x == 20) {
      if (this.intro_state == 3) {
        this.sprites_board_countdown.count_20x_3.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 2) {
        this.sprites_board_countdown.count_20x_2.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      } else if (this.intro_state == 1) {
        this.sprites_board_countdown.count_20x_1.draw(
          context,
          total_position[0] + row_hints_pixels,
          total_position[1] + col_hints_pixels
        );
      }
    } else {
      if (this.intro_state == 3) {
        this.sprites_board_countdown.count_5x_3.draw(
          context,
          total_position[0] + row_hints_pixels + (this.size_x - 5) / 2,
          total_position[1] + col_hints_pixels + (this.size_y - 5) / 2
        );
      } else if (this.intro_state == 2) {
        this.sprites_board_countdown.count_5x_2.draw(
          context,
          total_position[0] + row_hints_pixels + (this.size_x - 5) / 2,
          total_position[1] + col_hints_pixels + (this.size_y - 5) / 2
        );
      } else if (this.intro_state == 1) {
        this.sprites_board_countdown.count_5x_1.draw(
          context,
          total_position[0] + row_hints_pixels + (this.size_x - 5) / 2,
          total_position[1] + col_hints_pixels + (this.size_y - 5) / 2
        );
      }
    }
  }

  click_left(mouse_pos, mouse_state, current_sp_hp_tracker) {
    var click_at = this.cursor_position(mouse_pos);
    var new_animated_filled_cell;

    // Process left clicks.
    if (this.intro_state == 0) {
      if (click_at[0] != -1 && click_at[1] != -1) {
        if (
          this.solution[click_at[1]][click_at[0]] == 1 &&
          this.current_state[click_at[1]][click_at[0]] != -1 &&
          this.hold_on != -1
        ) {
          if (this.current_state[click_at[1]][click_at[0]] == 0) {
            new_animated_filled_cell = new sprite(this.tiles_sheet, 0, 32, 32, 32);
            new_animated_filled_cell.animated = true;
            new_animated_filled_cell.frame_period = 2;
            new_animated_filled_cell.add_frame(32, 32);
            new_animated_filled_cell.add_frame(64, 32);
            new_animated_filled_cell.add_frame(64, 0);
            this.filled_cell_sprites.push([new_animated_filled_cell, click_at[0], click_at[1]]);
          }
          this.current_state[click_at[1]][click_at[0]] = 1;

          this.hold_on = 1;
        } else if (this.current_state[click_at[1]][click_at[0]] == -1 && this.hold_on != 1) {
          this.current_state[click_at[1]][click_at[0]] = 0;
          this.hold_on = -1;
        } else if (this.hold_on != -1 && this.current_state[click_at[1]][click_at[0]] >= 0) {
          this.current_state[click_at[1]][click_at[0]] = -2;
          this.jiggle(50);
          this.default_grid.jiggle(50);
          this.default_grid.set_color(1);
          current_sp_hp_tracker.player_hp--;
          mouse_state.mouse1_click_hold = 0;
        }
      } else {
        mouse_state.mouse1_click_hold = 0;
      }
    }
  }

  click_right(mouse_pos, mouse_state) {
    var click_at = this.cursor_position(mouse_pos);
    if (this.intro_state == 0) {
      if (click_at[0] != -1 && click_at[1] != -1) {
        if (this.current_state[click_at[1]][click_at[0]] == 0 && this.hold_on != 1) {
          this.current_state[click_at[1]][click_at[0]] = -1;
          this.hold_on = -1;
        } else if (this.current_state[click_at[1]][click_at[0]] == -1 && this.hold_on != -1) {
          this.current_state[click_at[1]][click_at[0]] = 0;
          this.hold_on = 1;
        }
      } else {
        mouse_state.mouse2_click_hold = 0;
      }
    }
  }

  // This function creates a set of animated sprites.
  // Used when a new board is created, and when the player solves a row/col.
  // 'start_time' is the age of the board that the particular set of animating
  // sprites is created, and we include offsets from this time for the chain of sprites
  // to start animating at.
  // 'length' is the number of tiles in the row/col.
  // 'direction' is 0 if we're creating a new row/col on a new board, and 1 if
  // the player has just completed a row/col.

  // We also make sparks!

  // IN THE FUTURE make the animating hints their own object,
  // and then make an instance of the board create these objects for itself.  Do this for other
  // complex objects of this type when programming other games.
  // create_animating_hints(length, direction, hint_index) {
  //   var sprite_group = [];
  //   var temp_sprite;
  //   var temp_spark;
  //   // Cycle time is the delay between one cell of a column starting it's animation, and the next.
  //   var cycle_time = 8;
  //   var frame_period = 1;
  //   var x;
  //   var y;
  //   var hint_number = 0;
  //   var num_sparks = 20;
  //   var total_position = [this.position[0] + this.position_offset[0], this.position[1] + this.position_offset[1]];

  //   if (direction == 0) {
  //     for (x = 0; x < length; x++) {
  //       temp_sprite = new sprite(this.tiles_sheet, 320, 32, 32, 32);
  //       temp_sprite.animated = true;
  //       temp_sprite.frame_period = frame_period;
  //       temp_sprite.add_frame(288, 32);
  //       temp_sprite.add_frame(256, 32);
  //       temp_sprite.add_frame(224, 32);
  //       temp_sprite.add_frame(192, 32);
  //       temp_sprite.add_frame(160, 32);
  //       temp_sprite.add_frame(128, 32);
  //       temp_sprite.add_frame(96, 32);
  //       temp_sprite.add_frame(0, 32);
  //       sprite_group.push([hint_index, temp_sprite, this.age + x * cycle_time]);
  //     }
  //   } else {
  //     for (x = 0; x < length; x++) {
  //       temp_sprite = new sprite(this.tiles_sheet, 0, 0, 32, 32);
  //       temp_sprite.animated = true;
  //       temp_sprite.frame_period = frame_period;
  //       temp_sprite.add_frame(96, 32);
  //       temp_sprite.add_frame(128, 32);
  //       temp_sprite.add_frame(160, 32);
  //       temp_sprite.add_frame(192, 32);
  //       temp_sprite.add_frame(224, 32);
  //       temp_sprite.add_frame(256, 32);
  //       temp_sprite.add_frame(288, 32);
  //       temp_sprite.add_frame(320, 32);
  //       sprite_group.push([hint_index, temp_sprite, this.age + x * cycle_time]);

  //       if (hint_index >= this.size_y) {
  //         hint_number = hint_index - this.size_y;
  //         for (y = 0; y < num_sparks; y++) {
  //           temp_spark = new spark(
  //             total_position[0] +
  //               (this.hints_row_length + hint_number) * this.tile_size +
  //               this.tile_size * Math.random(),
  //             total_position[1] + x * this.tile_size + this.tile_size * Math.random(),
  //             0
  //           );
  //           this.spark_array.push([temp_spark, this.age + x * cycle_time]);
  //         }
  //       } else {
  //         hint_number = hint_index;
  //         for (y = 0; y < num_sparks; y++) {
  //           temp_spark = new spark(
  //             total_position[0] + x * this.tile_size + this.tile_size * Math.random(),
  //             total_position[1] +
  //               (this.hints_col_length + this.size_y - hint_number - 1) * this.tile_size +
  //               this.tile_size * Math.random(),
  //             3
  //           );
  //           this.spark_array.push([temp_spark, this.age + x * cycle_time]);
  //         }
  //       }
  //     }
  //   }
  //   return sprite_group;
  // }

  // create_animating_grid() {
  //   console.log("Begin create_animating_grid");
  //   var temp_sprite;
  //   var frame_period = 2; // Twiddle
  //   var start_age;
  //   var x;
  //   var rand_range = 20; // Twiddle
  //   // Number of rows and columns of animating bits we need.
  //   // A non-regulation board has two, a 10x10 has 3 of each, a 15x15 has 4, etc.
  //   var row_number = 0;
  //   var col_number = 0;

  //   if (!this.regulation_size) {
  //     row_number = 2;
  //     col_number = 2;
  //   } else {
  //     row_number = Math.floor(1 + this.size_x / 5);
  //     col_number = Math.floor(1 + this.size_y / 5);
  //   }

  //   for (x = 0; x < this.size_y * col_number; x++) {
  //     start_age = randint(0, rand_range) + this.age;
  //     temp_sprite = new sprite(this.board_grid_sheet, 0, 0, 5, 32);
  //     temp_sprite.animated = true;
  //     temp_sprite.frame_period = frame_period;
  //     temp_sprite.looping = false;
  //     temp_sprite.add_frame(6, 0);
  //     temp_sprite.add_frame(12, 0);
  //     temp_sprite.add_frame(18, 0);
  //     temp_sprite.add_frame(24, 0);
  //     temp_sprite.add_frame(27, 0);
  //     // [sprite object, start age, row index].  Row index is twice as long as row for the top and bottom row.
  //     this.animating_grid_cols.push([temp_sprite, start_age]);
  //   }
  //   for (x = 0; x < this.size_x * row_number; x++) {
  //     start_age = randint(0, rand_range) + this.age;
  //     temp_sprite = new sprite(this.board_grid_sheet, 32, 0, 32, 5);
  //     temp_sprite.animated = true;
  //     temp_sprite.frame_period = frame_period;
  //     temp_sprite.looping = false;
  //     temp_sprite.add_frame(32, 6);
  //     temp_sprite.add_frame(32, 12);
  //     temp_sprite.add_frame(32, 18);
  //     temp_sprite.add_frame(32, 24);
  //     temp_sprite.add_frame(32, 27);
  //     // [sprite object, start age, row index].  Row index is twice as long as row for the top and bottom row.
  //     this.animating_grid_rows.push([temp_sprite, start_age]);
  //   }
  // }

  initialize_hint_animations(style) {
    var x;
    var y;
    var temp_position;
    var pause_time = 4; // Twiddle.  Time between cell animation starts.
    var temp_array = [];

    // This is all zero style, happens by default.
    this.animating_row_hints = [];
    this.animating_col_hints = [];
    for (x = 0; x < this.size_x; x++) {
      temp_position = [this.position[0] + (x + this.hints_row_length) * this.tile_size, this.position[1]];
      this.animating_col_hints.push([
        new animated_hint(temp_position, this.hints_col_length, 1, this.tiles_sheet),
        this.intro_period
      ]);
    }
    for (x = 0; x < this.size_y; x++) {
      temp_position = [this.position[0], this.position[1] + (x + this.hints_col_length) * this.tile_size];
      this.animating_row_hints.push([
        new animated_hint(temp_position, this.hints_row_length, 0, this.tiles_sheet),
        this.intro_period
      ]);
    }
    console.log(this.animating_row_hints);

    if (style == 1) {
      // A big chain, bottom to right.
      y = 0;
      for (x = this.animating_row_hints.length - 1; x >= 0; x--) {
        this.animating_row_hints[x][1] += y * pause_time;
        y++;
      }
      for (x = 0; x < this.animating_col_hints.length; x++) {
        this.animating_col_hints[x][1] += y * pause_time;
        y++;
      }
    } else if (style == 2) {
      // Middle out, simultaneous.
      for (x = 0; x < this.animating_row_hints.length; x++) {
        this.animating_row_hints[x][1] += x * pause_time;
      }
      for (x = 0; x < this.animating_col_hints.length; x++) {
        this.animating_col_hints[x][1] += x * pause_time;
      }
    } else if (style == 3) {
      // Random
      temp_array = [];
      for (x = 0; x < this.animating_row_hints.length; x++) {
        temp_array.push(x);
      }
      temp_array = shuffle(temp_array);
      for (x = 0; x < this.animating_row_hints.length; x++) {
        this.animating_row_hints[x][1] += temp_array[x] * pause_time;
      }
      temp_array = [];
      for (x = 0; x < this.animating_col_hints.length; x++) {
        temp_array.push(x);
      }
      temp_array = shuffle(temp_array);
      for (x = 0; x < this.animating_col_hints.length; x++) {
        this.animating_col_hints[x][1] += temp_array[x] * pause_time;
      }
    } else if (style == 4) {
      // A big chain, right to bottom.
      y = 0;
      for (x = this.animating_col_hints.length - 1; x >= 0; x--) {
        this.animating_col_hints[x][1] += y * pause_time;
        y++;
      }
      for (x = 0; x < this.animating_row_hints.length; x++) {
        this.animating_row_hints[x][1] += y * pause_time;
        y++;
      }
    } else if (style == 5) {
      // Outside in, simultaneous.
      y = 0;
      for (x = this.animating_col_hints.length - 1; x >= 0; x--) {
        this.animating_col_hints[x][1] += y * pause_time;
        y++;
      }
      y = 0;
      for (x = this.animating_row_hints.length - 1; x >= 0; x--) {
        this.animating_row_hints[x][1] += y * pause_time;
        y++;
      }
    } else if (style == 6) {
      // Every other, there 'n back.
      y = 0;
      for (x = this.animating_row_hints.length - 1; x >= 0; x--) {
        if (!(x % 2)) {
          this.animating_row_hints[x][1] += y * pause_time;
          y++;
        }
      }
      for (x = 0; x < this.animating_col_hints.length; x++) {
        if (!(x % 2)) {
          this.animating_col_hints[x][1] += y * pause_time;
          y++;
        }
      }
      for (x = this.animating_col_hints.length - 1; x >= 0; x--) {
        if (x % 2) {
          this.animating_col_hints[x][1] += y * pause_time;
          y++;
        }
      }
      for (x = 0; x < this.animating_row_hints.length; x++) {
        if (x % 2) {
          this.animating_row_hints[x][1] += y * pause_time;
          y++;
        }
      }
    } else if (style == 7) {
      // Every other, crossover.
      y = 0;
      for (x = this.animating_row_hints.length - 1; x >= 0; x--) {
        if (!(x % 2)) {
          this.animating_row_hints[x][1] += y * pause_time;
          y++;
        }
      }
      for (x = 0; x < this.animating_col_hints.length; x++) {
        if (!(x % 2)) {
          this.animating_col_hints[x][1] += y * pause_time;
          y++;
        }
      }
      y = 0;
      for (x = this.animating_col_hints.length - 1; x >= 0; x--) {
        if (x % 2) {
          this.animating_col_hints[x][1] += y * pause_time;
          y++;
        }
      }
      for (x = 0; x < this.animating_row_hints.length; x++) {
        if (x % 2) {
          this.animating_row_hints[x][1] += y * pause_time;
          y++;
        }
      }
    }
  }

  // The bracket below here is the end of the class VVV
}
// export {sum_array, getMousePos};
