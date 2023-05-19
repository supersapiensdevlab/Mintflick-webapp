import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import { Feed } from "@/utils/models/feed.model";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { user_data_id, content, comment, replyTo, newText } = req;
    const { success, user, error } = await findOne({ _id: user_data_id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    if (content.videoId) {
      let obj = user.videos.find((video: any, i: any) => {
        if (video.videoId == content.videoId) {
          if (user.videos[i].comments) {
            return user.videos[i].comments.find((c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.videos[i].comments[j].reply) {
                  return user.videos[i].comments[j].reply.find(
                    (re: any, k: any) => {
                      if (comment._id == re._id) {
                        user.videos[i].comments[j].reply[k].comment = newText;
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  user.videos[i].comments[j].comment = newText;
                  return true;
                }
              }
            });
          }

          return true; // stop searching
        }
      });
      // for trending
      const trending = await Feed.findOne({
        "content.videoId": content.videoId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    trending.content.comments[j].reply[k].comment = newText;
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              trending.content.comments[j].comment = newText;
              return true;
            }
          }
        });
      }
      if (obj) {
        await user.markModified("videos");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();

        return NextResponse.json({
          status: "success",
          message: "Comment edited successfully",
        });
      }
    } else if (content.trackId) {
      let obj = user.tracks.find((track: any, i: any) => {
        if (track.trackId == content.trackId) {
          if (user.tracks[i].comments) {
            return user.tracks[i].comments.find((c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.tracks[i].comments[j].reply) {
                  return user.tracks[i].comments[j].reply.find(
                    (re: any, k: any) => {
                      if (comment._id == re._id) {
                        user.tracks[i].comments[j].reply[k].comment = newText;
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  user.tracks[i].comments[j].comment = newText;
                  return true;
                }
              }
            });
          }

          return true; // stop searching
        }
      });

      // for trending
      let trending = await Feed.findOne({
        "content.trackId": content.trackId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    trending.content.comments[j].reply[k].comment = newText;
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              trending.content.comments[j].comment = newText;
              return true;
            }
          }
        });
      }
      if (obj) {
        await user.markModified("tracks");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();
        return NextResponse.json({
          status: "success",
          message: "Comment edited successfully",
        });
      }
    } else if (content.announcement) {
      let obj = user.posts.find((post: any, i: any) => {
        if (post.postId == content.postId) {
          if (user.posts[i].comments) {
            return user.posts[i].comments.find((c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.posts[i].comments[j].reply) {
                  return user.posts[i].comments[j].reply.find(
                    (re: any, k: any) => {
                      if (comment._id == re._id) {
                        user.posts[i].comments[j].reply[k].comment = newText;
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  user.posts[i].comments[j].comment = newText;
                  return true;
                }
              }
            });
          }

          return true; // stop searching
        }
      });
      // for trending
      let trending = await Feed.findOne({
        // user_id: user_data_id,
        "content.postId": content.postId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    trending.content.comments[j].reply[k].comment = newText;
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              trending.content.comments[j].comment = newText;
              return true;
            }
          }
        });
      }
      if (obj) {
        await user.markModified("posts");
        await user.save();
        // trending
        await trending.markModified("content.comments");
        await trending.save();
        return NextResponse.json({
          status: "success",
          message: "Comment edited successfully",
        });
      }
    } else if (content.pollId) {
      let obj = user.polls.find((poll: any, i: any) => {
        if (poll.pollId == content.pollId) {
          if (user.polls[i].comments) {
            return user.polls[i].comments.find((c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.polls[i].comments[j].reply) {
                  return user.polls[i].comments[j].reply.find(
                    (re: any, k: any) => {
                      if (comment._id == re._id) {
                        user.polls[i].comments[j].reply[k].comment = newText;
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  user.polls[i].comments[j].comment = newText;
                  return true;
                }
              }
            });
          }

          return true; // stop searching
        }
      });
      // for trending
      let trending = await Feed.findOne({
        "content.pollId": content.pollId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    trending.content.comments[j].reply[k].comment = newText;
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              trending.content.comments[j].comment = newText;
              return true;
            }
          }
        });
      }
      if (obj) {
        await user.markModified("polls");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();
        return NextResponse.json({
          status: "success",
          message: "Comment edited successfully",
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
