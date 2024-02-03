class CancellationTokenSource {
  private AbortController: AbortController;

  public constructor() {
    this.AbortController = new AbortController();
  }

  public get Token() {
    return this.AbortController.signal;
  }

  public Cancel() {
    this.AbortController.abort();
  }
}

export default CancellationTokenSource;