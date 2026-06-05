namespace CadeODano.Services;

public class ServiceResult<T>
{
  public bool Result { get; private set; }
  public string? Message { get; private set; }
  public T? Data { get; private set; }

  public static ServiceResult<T> Success(T? data, string? message = null) =>
    new() { Result = true, Message = message, Data = data };

  public static ServiceResult<T> Fail(string message) =>
    new() { Result = false, Message = message };
}
