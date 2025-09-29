public interface IBlobStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string containerName);
    Task<bool> DeleteFileAsync(string fileName, string containerName);
    Task<Stream?> DownloadFileAsync(string fileName, string containerName);
    string GetSasUrl(string fileName, string containerName, TimeSpan validFor);
}