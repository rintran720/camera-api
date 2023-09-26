import { HikvisionCamera } from "./HikvisionCamera";
const crypto = require("crypto");

interface ISearchVideoHikvision {
  startTime: string;
  endTime: string;
  searchID?: string;
  trackID?: string;
  maxResults?: number;
  searchResultPostion?: number;
}

interface IDownloadVideoHikvision {
  trackID?: string;
  filename: string;
}

export class HikvisionNvr extends HikvisionCamera {
  searchVideo({
    startTime,
    endTime,
    searchID = crypto.randomBytes(4).toString("hex").toUpperCase() +
      "-" +
      crypto.randomBytes(2).toString("hex").toUpperCase() +
      "-" +
      crypto.randomBytes(2).toString("hex").toUpperCase() +
      "-" +
      crypto.randomBytes(2).toString("hex").toUpperCase() +
      "-" +
      crypto.randomBytes(6).toString("hex").toUpperCase(),

    trackID = "101",
    maxResults = 50,
    searchResultPostion = 0,
  }: ISearchVideoHikvision) {
    try {
      const xmlBodyStr = `<?xml version="1.0" encoding="utf-8"?>
      <CMSearchDescription>
          <searchID>${searchID}</searchID>
          <trackList>
              <trackID>${trackID}</trackID>
          </trackList>
          <timeSpanList>
              <timeSpan>
                  <startTime>${startTime}</startTime>
                  <endTime>${endTime}</endTime>
              </timeSpan>
          </timeSpanList>
          <maxResults>${maxResults}</maxResults>
          <searchResultPostion>${searchResultPostion}</searchResultPostion>
          <metadataList>
              <metadataDescriptor>//recordType.meta.std-cgi.com/AllEvent</metadataDescriptor>
          </metadataList>
      </CMSearchDescription>
    `;

      const config = {
        headers: { "Content-Type": "application/xml" },
      };

      return this.axios.post("/ISAPI/ContentMgmt/search", xmlBodyStr, config);
    } catch (e) {
      console.log("error", e);
    }
  }

  downloadVideo({ trackID = "101", filename }: IDownloadVideoHikvision) {
    try {
      const xmlBodyStr = `<?xml version="1.0" encoding="UTF-8"?>
      <downloadRequest version="1.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
          <playbackURI>rtsp://IpAddress/Streaming/tracks/${trackID}?filename=${filename}</playbackURI>
      </downloadRequest>
    `;

      const config = {
        headers: { "Content-Type": "application/xml" },
      };

      return this.axios.post("/ISAPI/ContentMgmt/download", xmlBodyStr, config);
    } catch (e) {
      console.log("error", e);
    }
  }
}
