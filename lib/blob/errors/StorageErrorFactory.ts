import StorageError from "./StorageError";

export default class StorageErrorFactory {
  public static getContainerNotFoundError(contextID: string): StorageError {
    return new StorageError(
      404,
      "ContainerNotFound",
      "The specified container does not exist.",
      contextID
    );
  }

  public static getContainerAlreadyExists(contextID: string): StorageError {
    return new StorageError(
      409,
      "ContainerAlreadyExists",
      "The specified container already exists.",
      contextID
    );
  }
}
