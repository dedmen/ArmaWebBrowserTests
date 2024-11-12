// eslint-disable-next-line no-console
console.log('Hello world!');

// Inject A3API into window, so it becomes accessible via window.A3API, Engine also needs it to call back into it to send us responses
// The true there, sets override flag, we intentionally overwrite the API that the engine already provides
import "expose-loader?exposes=A3API|A3API|true!./A3API";

// Inject KillTracker into window. We will call into it from script
import "expose-loader?exposes=KillTracker|KillTracker!./KillTracker";

import "./main.scss";

