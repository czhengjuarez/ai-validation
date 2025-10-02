/// <reference types="@cloudflare/workers-types" />

declare module "@cloudflare/workers-types" {
  interface Env {
    PLAYBOOKS_BUCKET: R2Bucket;
  }
}
