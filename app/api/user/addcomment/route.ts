import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate, findOne } from "@/utils/user/user";
import mongoose from "mongoose";
import { Feed } from "@/utils/models/feed.model";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    var id = new mongoose.Types.ObjectId();
    const { user_data_id, content, comment, replyTo } = req;
    const { success, user, error } = await findOne({ _id: user_data_id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const cuser = await findOne({ _id: req.user_id });
    if (!cuser.success) {
      return NextResponse.json({ status: "error", message: cuser.user.error });
    }
    const announcementData = {
      announcement: `${cuser.user.username} commented on your post`,
      post_image: cuser.user.profile_image ? cuser.user.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${cuser.user.username}`,
      time: Date.now() / 1000,
      username: cuser.user.username,
      linkpreview_data: null,
    };

    if (content.videoId) {
      const obj = user.videos.find(async (video: any, i: any) => {
        if (video.videoId == content.videoId) {
          if (user.videos[i].comments) {
            if (replyTo) {
              user.videos[i].comments.find(async (c: any, j: any) => {
                if (c._id == replyTo) {
                  if (user.videos[i].comments[j].reply) {
                    user.videos[i].comments[j].reply.push({
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    });
                  } else {
                    user.videos[i].comments[j].reply = [
                      {
                        _id: id,
                        user_id: req.user_id,
                        comment: comment,
                        likes: [],
                      },
                    ];
                  }

                  // For notification to reply user
                  const ad = {
                    announcement: `${cuser.user.username} replied to your comment on video of ${user.username}`,
                    post_image: cuser.user.profile_image
                      ? cuser.user.profile_image
                      : null,
                    post_video: null,
                    link: `/homescreen/${user.username}/video/${user.videos[i].videoId}`,
                    time: Date.now() / 1000,
                    username: cuser.user.username,
                    linkpreview_data: null,
                  };

                  const pushNoti = await findOneAndUpdate(
                    { _id: c.user_id },
                    {
                      $push: {
                        notification: ad,
                      },
                    },
                    {}
                  );
                  if (!pushNoti.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNoti.error,
                    });
                  }
                }
              });
            } else {
              user.videos[i].comments.push({
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              });
            }
          } else {
            user.videos[i].comments = [
              {
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              },
            ];
          }

          // For notification
          announcementData.announcement = `${cuser.user.username} commented on your video`;
          announcementData.link = `/homescreen/${user.username}/video/${user.videos[i].videoId}`;
          user.notification.push(announcementData);

          return true; // stop searching
        }
      });
      // for trending
      const trending = await Feed.findOne({
        "content.videoId": content.videoId,
      });
      if (trending) {
        if (trending.content.comments) {
          if (replyTo) {
            trending.content.comments.find((c: any, i: any) => {
              if (c._id == replyTo) {
                if (trending.content.comments[i].reply) {
                  trending.content.comments[i].reply.push({
                    _id: id,
                    user_id: req.user_id,
                    comment: comment,
                    likes: [],
                  });
                } else {
                  trending.content.comments[i].reply = [
                    {
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    },
                  ];
                }
              }
            });
          } else {
            trending.content.comments.push({
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            });
          }
        } else {
          trending.content.comments = [
            {
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            },
          ];
        }
      }
      if (obj) {
        await user.markModified("videos");
        await user.save();
        // trending
        await trending.markModified("content.comments");
        await trending.save();
        return NextResponse.json({
          status: "success",
          message: "Comment created successfully",
          id: id,
        });
      }
    } else if (content.trackId) {
      const obj = user.tracks.find((track: any, i: any) => {
        if (track.trackId == content.trackId) {
          if (user.tracks[i].comments) {
            if (replyTo) {
              user.tracks[i].comments.find(async (c: any, j: any) => {
                if (c._id == replyTo) {
                  if (user.tracks[i].comments[j].reply) {
                    user.tracks[i].comments[j].reply.push({
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    });
                  } else {
                    user.tracks[i].comments[j].reply = [
                      {
                        _id: id,
                        user_id: req.user_id,
                        comment: comment,
                        likes: [],
                      },
                    ];
                  }

                  // For notification to reply user
                  const ad = {
                    announcement: `${cuser.user.username} replied to your comment on track of ${user.username}`,
                    post_image: cuser.user.profile_image
                      ? cuser.user.profile_image
                      : null,
                    post_video: null,
                    link: `/homescreen/${user.username}/track/${user.tracks[i].trackId}`,
                    time: Date.now() / 1000,
                    username: cuser.user.username,
                    linkpreview_data: null,
                  };

                  const pushNoti = await findOneAndUpdate(
                    { _id: c.user_id },
                    {
                      $push: {
                        notification: ad,
                      },
                    },
                    {}
                  );
                  if (!pushNoti.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNoti.error,
                    });
                  }
                }
              });
            } else {
              user.tracks[i].comments.push({
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              });
            }
          } else {
            user.tracks[i].comments = [
              {
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              },
            ];
          }

          // For notification
          announcementData.announcement = `${cuser.user.username} commented on your track`;
          announcementData.link = `/homescreen/${user.username}/track/${user.tracks[i].trackId}`;
          user.notification.push(announcementData);

          return true; // stop searching
        }
      });
      // for trending
      const trending = await Feed.findOne({
        "content.trackId": content.trackId,
      });
      if (trending) {
        if (trending.content.comments) {
          if (replyTo) {
            trending.content.comments.find((c: any, i: any) => {
              if (c._id == replyTo) {
                if (trending.content.comments[i].reply) {
                  trending.content.comments[i].reply.push({
                    _id: id,
                    user_id: req.user_id,
                    comment: comment,
                    likes: [],
                  });
                } else {
                  trending.content.comments[i].reply = [
                    {
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    },
                  ];
                }
              }
            });
          } else {
            trending.content.comments.push({
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            });
          }
        } else {
          trending.content.comments = [
            {
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            },
          ];
        }
      }

      if (obj) {
        await user.markModified("tracks");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();

        return NextResponse.json({
          status: "success",
          message: "Comment created successfully",
          id: id,
        });
      }
    } else if (content.announcement) {
      const obj = user.posts.find((post: any, i: any) => {
        if (post.postId == content.postId) {
          if (user.posts[i].comments) {
            if (replyTo) {
              user.posts[i].comments.find(async (c: any, j: any) => {
                if (c._id == replyTo) {
                  if (user.posts[i].comments[j].reply) {
                    user.posts[i].comments[j].reply.push({
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    });
                  } else {
                    user.posts[i].comments[j].reply = [
                      {
                        _id: id,
                        user_id: req.user_id,
                        comment: comment,
                        likes: [],
                      },
                    ];
                  }

                  // For notification to reply user
                  const ad = {
                    announcement: `${cuser.user.username} replied to your comment on post of ${user.username}`,
                    post_image: cuser.user.profile_image
                      ? cuser.user.profile_image
                      : null,
                    post_video: null,
                    link: `/homescreen/${user.username}/post/${user.posts[i].postId}`,
                    time: Date.now() / 1000,
                    username: cuser.user.username,
                    linkpreview_data: null,
                  };

                  console.log(ad);
                  console.log("sending to", c.user_id);

                  const pushNoti = await findOneAndUpdate(
                    { _id: c.user_id },
                    {
                      $push: {
                        notification: ad,
                      },
                    },
                    {}
                  );
                  if (!pushNoti.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNoti.error,
                    });
                  }
                }
              });
            } else {
              user.posts[i].comments.push({
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              });
            }
          } else {
            user.posts[i].comments = [
              {
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              },
            ];
          }

          // For notification
          announcementData.announcement = `${cuser.user.username} commented on your post`;
          announcementData.link = `/homescreen/${user.username}/post/${user.posts[i].postId}`;
          user.notification.push(announcementData);

          return true; // stop searching
        }
      });

      // for trending
      const trending = await Feed.findOne({
        // user_id: user_data_id,
        "content.postId": content.postId,
      });

      if (trending) {
        if (trending.content.comments) {
          if (replyTo) {
            trending.content.comments.find((c: any, i: any) => {
              if (c._id == replyTo) {
                if (trending.content.comments[i].reply) {
                  trending.content.comments[i].reply.push({
                    _id: id,
                    user_id: req.user_id,
                    comment: comment,
                    likes: [],
                  });
                } else {
                  trending.content.comments[i].reply = [
                    {
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    },
                  ];
                }
              }
            });
          } else {
            trending.content.comments.push({
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            });
          }
        } else {
          trending.content.comments = [
            {
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            },
          ];
        }
      }

      if (obj) {
        await user.markModified("posts");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();

        return NextResponse.json({
          status: "success",
          message: "Comment created successfully",
          id: id,
        });
      }
    } else if (content.pollId) {
      console.log("in");
      const obj = user.polls.find((poll: any, i: any) => {
        if (poll.pollId == content.pollId) {
          if (user.polls[i].comments) {
            if (replyTo) {
              user.polls[i].comments.find(async (c: any, j: any) => {
                if (c._id == replyTo) {
                  if (user.polls[i].comments[j].reply) {
                    user.polls[i].comments[j].reply.push({
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    });
                  } else {
                    user.polls[i].comments[j].reply = [
                      {
                        _id: id,
                        user_id: req.user_id,
                        comment: comment,
                        likes: [],
                      },
                    ];
                  }

                  // For notification to reply user
                  const ad = {
                    announcement: `${cuser.user.username} replied to your comment on poll of ${user.username}`,
                    post_image: cuser.user.profile_image
                      ? cuser.user.profile_image
                      : null,
                    post_video: null,
                    link: `/homescreen/${user.username}/poll/${user.polls[i].pollId}`,
                    time: Date.now() / 1000,
                    username: cuser.user.username,
                    linkpreview_data: null,
                  };

                  const pushNoti = await findOneAndUpdate(
                    { _id: c.user_id },
                    {
                      $push: {
                        notification: ad,
                      },
                    },
                    {}
                  );
                  if (!pushNoti.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNoti.error,
                    });
                  }
                }
              });
            } else {
              user.polls[i].comments.push({
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              });
            }
          } else {
            user.polls[i].comments = [
              {
                _id: id,
                user_id: req.user_id,
                comment: comment,
                likes: [],
              },
            ];
          }

          // For notification
          announcementData.announcement = `${cuser.user.username} commented on your poll`;
          announcementData.link = `/homescreen/${user.username}/poll/${user.polls[i].pollId}`;
          user.notification.push(announcementData);

          return true; // stop searching
        }
      });

      // for trending
      const trending = await Feed.findOne({
        // user_id: user_data_id,
        "content.pollId": content.pollId,
      });

      if (trending) {
        if (trending.content.comments) {
          if (replyTo) {
            trending.content.comments.find((c: any, i: any) => {
              if (c._id == replyTo) {
                if (trending.content.comments[i].reply) {
                  trending.content.comments[i].reply.push({
                    _id: id,
                    user_id: req.user_id,
                    comment: comment,
                    likes: [],
                  });
                } else {
                  trending.content.comments[i].reply = [
                    {
                      _id: id,
                      user_id: req.user_id,
                      comment: comment,
                      likes: [],
                    },
                  ];
                }
              }
            });
          } else {
            trending.content.comments.push({
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            });
          }
        } else {
          trending.content.comments = [
            {
              _id: id,
              user_id: req.user_id,
              comment: comment,
              likes: [],
            },
          ];
        }
      }

      if (obj) {
        await user.markModified("polls");
        await user.save();

        // trending
        await trending.markModified("content.comments");
        await trending.save();

        return NextResponse.json({
          status: "success",
          message: "Comment created successfully",
          id: id,
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
