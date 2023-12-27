import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function TrimWhiteSpace(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'trimmedWhiteSpace',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return true; // Skip non-string values
          }
          const trimmedValue = value.trim();
          if (args.object[propertyName] !== trimmedValue) {
            args.object[propertyName] = trimmedValue;
          }
          return true;
        },
      },
    });
  };
}
