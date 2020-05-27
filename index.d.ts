export interface Component {
}

export class Registry {
  register(cssClassName: string, componentCtor: function(new: Component), options: any);
  run();
}
