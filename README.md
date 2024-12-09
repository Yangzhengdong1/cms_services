# CMS_SERVICE
## 后台管理系统
- 根据部门区分菜单权限
- 根据角色区分具体权限
- 部门包含角色，部门被删除时，角色要随之删除
- 各种权限只有特定的用户才能操作
- 角色与部门被删除时，用户表中的 user_id 与 department_id 置空

### 2024.11.23
 **接口**
- [x] 完成创建用户接口
- [x] 完成用户登录接口
- [x] 完成查询用户信息接口
- [ ] 完成查询用户所属部门菜单接口
- [ ] 创建用户时，需要校验传递的角色id是否处于传递的部门下


### 2024.11.24
 **功能**
- [x] 查询用户所属部门菜单接口列表转树结构功能完成
- [x] 角色权限校验功能完成
- [ ] 是否需要校验菜单重名？


**接口**

- [x] 修改菜单接口完成
- [x] 创建菜单接口完成
- [x] 删除菜单接口完成

**数据库**
- [x] 完善 mysql 外键引用规则


### 2024.11.25

**接口**
- [x] 测试token是否生效接口完成
- [x] 查询全部菜单接口完成
- [x] 创建权限接口完成


### 2024.11.26
**功能**
- [x] 完善中间件相关注释

**接口**
- [x] 字典表查询接口完成
- [x] 完善菜单分页查询接口

**数据库**
- [x] 完善用户表外键引用规则


### 2024.11.27
**功能**
- [x] 创建用户时，校验传递的角色id是否处于传递的部门下
- [x] 完善创建用户接口校验


**接口**
- [x] 角色权限关联接口完成

**数据库**

- [x] 用户表新增 role_name 与 department_name 字段

### 2024.11.28
**接口**
- [x] 创建角色接口完成
- [x] 创建部门接口初步完成

**功能**
- [x] 完善角色权限关联相关逻辑


### 2024.11.29
**功能**
- [x] 登录接口新增用户是否激活判断

**接口**
- [x] 部门菜单关联接口完成
- [x] 创建部门接口完成

### 2024.12.01
**功能**
- [x] 完善角色权限校验功能

**接口**
- [x] 新增文件上传接口


### 2024.12.04
**功能**
- [x] 分页参数处理抽取为单独的中间件函数

**接口**
- [x] 查询用户信息新增 avatar_url 字段
- [x] 分页查询用户列表接口完成


### 2024.12.07
**功能**
- [x] 完善分页校验中间件逻辑

**接口**
- [x] 用户列表分页查询接口参数过多改为 post 请求

**数据库**
- [x] 用户表新增 realname 字段


### 2024.12.09
**功能**
- [x] 修复分页中间件参数处理错误的问题

**接口**
- [x] 删除部门接口完成
- [x] 分页查询部门列表接口完成
- [x] 完善字典表查询接口逻辑

**数据库**
- [x] 新增 levels 表