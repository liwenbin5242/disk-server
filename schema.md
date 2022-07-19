users: {
   _id: 主键,
   username: string,
   password: string,
   phone: string,
   name: string,
   avatar: string,
   inviters: array,
   role: string, admin, member, visitor,
   ctm: string,
   utm: string
}

disks: {
   _id: 主键,
   uk: string,
   access_token: string,
   avatar_url: string,
   baidu_name: string,
   expire_in: number,
   netdisk_name: string,
   refresh_token: string, ,
   scope: string,
   uptime: string,
   username: string,
   cookies: string,
}

groups: {
    username: string,
    avatar_url: string,
    name: string,
    gid: string,
    ctime: number,
    group_status: number,
    gtype: string,
    uk: number,
    is_share: 1,
}

