import {
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from "@nestjs/common";

/**
 * returns a 422 in case of validation error.
 */
const validationPipe = new ValidationPipe({
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException(errors, "validation error");
  },
});
export default validationPipe;
