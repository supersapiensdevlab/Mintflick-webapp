import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { Feed } from "@/utils/models/feed.model";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { user_data_id, content, comment, replyTo } = req;
    const { success, user, error } = await findOne({ _id: user_data_id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    const cuser = await findOne({ _id: req.user_id });
    if (!cuser.success) {
      return NextResponse.json({ status: "error", message: cuser.error });
    }
    // For Notification
    const announcementData = {
      announcement: `${cuser.user.username} liked your comment on post of ${user.username}`,
      post_image: cuser.user.profile_image ? cuser.user.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${cuser.user.username}`,
      time: Date.now() / 1000,
      username: cuser.user.username,
      linkpreview_data: null,
    };
    let tonotification = null;

    if (content.videoId) {
      const obj = user.videos.find((video: any, i: any) => {
        if (video.videoId == content.videoId) {
          if (user.videos[i].comments) {
            return user.videos[i].comments.find(async (c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.videos[i].comments[j].reply) {
                  return user.videos[i].comments[j].reply.find(
                    async (re: any, k: any) => {
                      if (comment._id == re._id) {
                        if (
                          user.videos[i].comments[j].reply[k].likes.includes(
                            req.user_id
                          )
                        ) {
                          user.videos[i].comments[j].reply[k].likes.splice(
                            user.videos[i].comments[j].reply[k].likes.indexOf(
                              req.user_id
                            ),
                            1
                          );

                          announcementData.announcement = `${cuser.user.username} unliked your reply comment on video of ${user.username}`;
                        } else {
                          user.videos[i].comments[j].reply[k].likes.push(
                            req.user_id
                          );

                          announcementData.announcement = `${cuser.user.username} liked your reply comment on video of ${user.username}`;
                        }

                        // FOr notification
                        tonotification =
                          user.videos[i].comments[j].reply[k].user_id;
                        announcementData.link = `/homescreen/${user.username}/video/${user.videos[i].videoId}`;

                        // For notification
                        const pushNotificationVideo = await findOneAndUpdate(
                          { _id: tonotification },
                          {
                            $push: {
                              notification: announcementData,
                            },
                          },
                          {}
                        );
                        if (!pushNotificationVideo.success) {
                          return NextResponse.json({
                            status: "error",
                            message: pushNotificationVideo.error,
                          });
                        }

                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  if (user.videos[i].comments[j].likes.includes(req.user_id)) {
                    user.videos[i].comments[j].likes.splice(
                      user.videos[i].comments[j].likes.indexOf(req.user_id),
                      1
                    );
                    announcementData.announcement = `${cuser.user.username} unliked your comment on video of ${user.username}`;
                  } else {
                    user.videos[i].comments[j].likes.push(req.user_id);
                    announcementData.announcement = `${cuser.user.username} liked your comment on video of ${user.username}`;
                  }
                  // FOr notification
                  tonotification = user.videos[i].comments[j].user_id;
                  announcementData.link = `/homescreen/${user.username}/video/${user.videos[i].videoId}`;

                  // For notification
                  const pushNotificationVideo2 = await findOneAndUpdate(
                    { _id: tonotification },
                    {
                      $push: {
                        notification: announcementData,
                      },
                    },

                    {}
                  );
                  if (!pushNotificationVideo2.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNotificationVideo2.error,
                    });
                  }
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
                    if (
                      trending.content.comments[j].reply[k].likes.includes(
                        req.user_id
                      )
                    ) {
                      trending.content.comments[j].reply[k].likes.splice(
                        trending.content.comments[j].reply[k].likes.indexOf(
                          req.user_id
                        ),
                        1
                      );
                    } else {
                      trending.content.comments[j].reply[k].likes.push(
                        req.user_id
                      );
                    }
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              if (trending.content.comments[j].likes.includes(req.user_id)) {
                trending.content.comments[j].likes.splice(
                  trending.content.comments[j].likes.indexOf(req.user_id),
                  1
                );
              } else {
                trending.content.comments[j].likes.push(req.user_id);
              }
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
          message: "Comment liked successfully",
        });
      }
    } else if (content.trackId) {
      const obj = user.tracks.find((track: any, i: any) => {
        if (track.trackId == content.trackId) {
          if (user.tracks[i].comments) {
            return user.tracks[i].comments.find(async (c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.tracks[i].comments[j].reply) {
                  return user.tracks[i].comments[j].reply.find(
                    async (re: any, k: any) => {
                      if (comment._id == re._id) {
                        if (
                          user.tracks[i].comments[j].reply[k].likes.includes(
                            req.user_id
                          )
                        ) {
                          user.tracks[i].comments[j].reply[k].likes.splice(
                            user.tracks[i].comments[j].reply[k].likes.indexOf(
                              req.user_id
                            ),
                            1
                          );
                          announcementData.announcement = `${cuser.user.username} unliked your reply comment on track of ${user.username}`;
                        } else {
                          user.tracks[i].comments[j].reply[k].likes.push(
                            req.user_id
                          );

                          announcementData.announcement = `${cuser.user.username} liked your reply comment on track of ${user.username}`;
                        }
                        // FOr notification
                        tonotification =
                          user.tracks[i].comments[j].reply[k].user_id;
                        announcementData.link = `/homescreen/${user.username}/track/${user.tracks[i].trackId}`;

                        // For notification
                        const pushNotificationTrack = await findOneAndUpdate(
                          { _id: tonotification },
                          {
                            $push: {
                              notification: announcementData,
                            },
                          },
                          {}
                        );
                        if (!pushNotificationTrack.success) {
                          return NextResponse.json({
                            status: "error",
                            message: pushNotificationTrack.error,
                          });
                        }
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  if (user.tracks[i].comments[j].likes.includes(req.user_id)) {
                    user.tracks[i].comments[j].likes.splice(
                      user.tracks[i].comments[j].likes.indexOf(req.user_id),
                      1
                    );
                    announcementData.announcement = `${cuser.user.username} unliked your comment on track of ${user.username}`;
                  } else {
                    user.tracks[i].comments[j].likes.push(req.user_id);
                    announcementData.announcement = `${cuser.user.username} liked your comment on track of ${user.username}`;
                  }
                  tonotification = user.tracks[i].comments[j].user_id;
                  announcementData.link = `/homescreen/${user.username}/track/${user.tracks[i].trackId}`;

                  // For notification
                  const pushNotificationTrack = await findOneAndUpdate(
                    { _id: tonotification },
                    {
                      $push: {
                        notification: announcementData,
                      },
                    },
                    {}
                  );
                  if (!pushNotificationTrack.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNotificationTrack.error,
                    });
                  }

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
        "content.trackId": content.trackId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    if (
                      trending.content.comments[j].reply[k].likes.includes(
                        req.user_id
                      )
                    ) {
                      trending.content.comments[j].reply[k].likes.splice(
                        trending.content.comments[j].reply[k].likes.indexOf(
                          req.user_id
                        ),
                        1
                      );
                    } else {
                      trending.content.comments[j].reply[k].likes.push(
                        req.user_id
                      );
                    }
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              if (trending.content.comments[j].likes.includes(req.user_id)) {
                trending.content.comments[j].likes.splice(
                  trending.content.comments[j].likes.indexOf(req.user_id),
                  1
                );
              } else {
                trending.content.comments[j].likes.push(req.user_id);
              }
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
          message: "Comment liked successfully",
        });
      }
    } else if (content.announcement) {
      const obj = user.posts.find((post: any, i: any) => {
        if (post.postId == content.postId) {
          if (user.posts[i].comments) {
            return user.posts[i].comments.find(async (c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.posts[i].comments[j].reply) {
                  return user.posts[i].comments[j].reply.find(
                    async (re: any, k: any) => {
                      if (comment._id == re._id) {
                        if (
                          user.posts[i].comments[j].reply[k].likes.includes(
                            req.user_id
                          )
                        ) {
                          user.posts[i].comments[j].reply[k].likes.splice(
                            user.posts[i].comments[j].reply[k].likes.indexOf(
                              req.user_id
                            ),
                            1
                          );

                          announcementData.announcement = `${cuser.user.username} unliked your reply comment on post of ${user.username}`;
                        } else {
                          user.posts[i].comments[j].reply[k].likes.push(
                            req.user_id
                          );

                          announcementData.announcement = `${cuser.user.username} liked your reply comment on post of ${user.username}`;
                        }

                        tonotification =
                          user.posts[i].comments[j].reply[k].user_id;
                        announcementData.link = `/homescreen/${user.username}/post/${user.posts[i].postId}`;

                        // For notification
                        const pushNotificationPost = await findOneAndUpdate(
                          { _id: tonotification },
                          {
                            $push: {
                              notification: announcementData,
                            },
                          },
                          {}
                        );
                        if (!pushNotificationPost.success) {
                          return NextResponse.json({
                            status: "error",
                            message: pushNotificationPost.error,
                          });
                        }
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  if (user.posts[i].comments[j].likes.includes(req.user_id)) {
                    user.posts[i].comments[j].likes.splice(
                      user.posts[i].comments[j].likes.indexOf(req.user_id),
                      1
                    );
                    announcementData.announcement = `${cuser.user.username} unliked your comment on post of ${user.username}`;
                  } else {
                    user.posts[i].comments[j].likes.push(req.user_id);

                    announcementData.announcement = `${cuser.user.username} liked your reply comment on post of ${user.username}`;
                  }

                  tonotification = user.posts[i].comments[j].user_id;
                  announcementData.link = `/homescreen/${user.username}/post/${user.posts[i].postId}`;

                  // For notification
                  const pushNotificationPost = await findOneAndUpdate(
                    { _id: tonotification },
                    {
                      $push: {
                        notification: announcementData,
                      },
                    },
                    {}
                  );
                  if (!pushNotificationPost.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNotificationPost.error,
                    });
                  }
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
                    if (
                      trending.content.comments[j].reply[k].likes.includes(
                        req.user_id
                      )
                    ) {
                      trending.content.comments[j].reply[k].likes.splice(
                        trending.content.comments[j].reply[k].likes.indexOf(
                          req.user_id
                        ),
                        1
                      );
                    } else {
                      trending.content.comments[j].reply[k].likes.push(
                        req.user_id
                      );
                    }
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              if (trending.content.comments[j].likes.includes(req.user_id)) {
                trending.content.comments[j].likes.splice(
                  trending.content.comments[j].likes.indexOf(req.user_id),
                  1
                );
              } else {
                trending.content.comments[j].likes.push(req.user_id);
              }
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
          message: "Comment liked successfully",
        });
      }
    } else if (content.pollId) {
      const obj = user.polls.find((poll: any, i: any) => {
        if (poll.pollId == content.pollId) {
          if (user.polls[i].comments) {
            return user.polls[i].comments.find(async (c: any, j: any) => {
              if (replyTo && c._id == replyTo) {
                if (user.polls[i].comments[j].reply) {
                  return user.polls[i].comments[j].reply.find(
                    async (re: any, k: any) => {
                      if (comment._id == re._id) {
                        if (
                          user.polls[i].comments[j].reply[k].likes.includes(
                            req.user_id
                          )
                        ) {
                          user.polls[i].comments[j].reply[k].likes.splice(
                            user.polls[i].comments[j].reply[k].likes.indexOf(
                              req.user_id
                            ),
                            1
                          );

                          announcementData.announcement = `${cuser.user.username} unliked your reply comment on poll of ${user.username}`;
                        } else {
                          user.polls[i].comments[j].reply[k].likes.push(
                            req.user_id
                          );

                          announcementData.announcement = `${cuser.user.username} liked your reply comment on poll of ${user.username}`;
                        }

                        tonotification =
                          user.polls[i].comments[j].reply[k].user_id;
                        announcementData.link = `/homescreen/${user.username}/poll/${user.polls[i].pollId}`;

                        // For notification
                        const pushNotificationPoll = await findOneAndUpdate(
                          { _id: tonotification },
                          {
                            $push: {
                              notification: announcementData,
                            },
                          },
                          {}
                        );
                        if (!pushNotificationPoll.success) {
                          return NextResponse.json({
                            status: "error",
                            message: pushNotificationPoll.error,
                          });
                        }
                        return true;
                      }
                    }
                  );
                }
              } else {
                if (comment._id == c._id) {
                  if (user.polls[i].comments[j].likes.includes(req.user_id)) {
                    user.polls[i].comments[j].likes.splice(
                      user.polls[i].comments[j].likes.indexOf(req.user_id),
                      1
                    );
                    announcementData.announcement = `${cuser.user.username} unliked your comment on poll of ${user.username}`;
                  } else {
                    user.polls[i].comments[j].likes.push(req.user_id);
                    announcementData.announcement = `${cuser.user.username} liked your comment on poll of ${user.username}`;
                  }

                  tonotification = user.polls[i].comments[j].user_id;
                  announcementData.link = `/homescreen/${user.username}/poll/${user.polls[i].pollId}`;

                  // For notification
                  const pushNotificationPoll = await findOneAndUpdate(
                    { _id: tonotification },
                    {
                      $push: {
                        notification: announcementData,
                      },
                    },
                    {}
                  );
                  if (!pushNotificationPoll.success) {
                    return NextResponse.json({
                      status: "error",
                      message: pushNotificationPoll.error,
                    });
                  }
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
        "content.pollId": content.pollId,
      });
      if (trending && trending.content.comments) {
        trending.content.comments.find((c: any, j: any) => {
          if (replyTo && c._id == replyTo) {
            if (trending.content.comments[j].reply) {
              return trending.content.comments[j].reply.find(
                (re: any, k: any) => {
                  if (comment._id == re._id) {
                    if (
                      trending.content.comments[j].reply[k].likes.includes(
                        req.user_id
                      )
                    ) {
                      trending.content.comments[j].reply[k].likes.splice(
                        trending.content.comments[j].reply[k].likes.indexOf(
                          req.user_id
                        ),
                        1
                      );
                    } else {
                      trending.content.comments[j].reply[k].likes.push(
                        req.user_id
                      );
                    }
                    return true;
                  }
                }
              );
            }
          } else {
            if (comment._id == c._id) {
              if (trending.content.comments[j].likes.includes(req.user_id)) {
                trending.content.comments[j].likes.splice(
                  trending.content.comments[j].likes.indexOf(req.user_id),
                  1
                );
              } else {
                trending.content.comments[j].likes.push(req.user_id);
              }
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
          message: "Comment liked successfully",
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
