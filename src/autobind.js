export default function autobind(Class) {
  for (const methodName of Object.getOwnPropertyNames(Class.prototype)) {
    var desc = Object.getOwnPropertyDescriptor(Class.prototype, methodName);
    if (methodName !== 'constructor' && desc.value) {
      ((method) => {
        Object.defineProperty(Class.prototype, methodName, {
          get: function() {
            if (this === Class.prototype) {return method;}
            const boundMethod = method.bind(this);
            Object.defineProperty(this, methodName, {value: boundMethod});
            return boundMethod;
          },
        });
      })(Class.prototype[methodName]);
    }
  }
  return Class;
}
