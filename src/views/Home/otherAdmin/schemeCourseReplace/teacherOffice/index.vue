<template>
	<div class="collapse">
		<a-table :columns="columns" :data-source="datas" :pagination="false" rowKey="id" bordered>
			<!-- slot中的name是指scopedSlots中customRender  slot-scope="text"的text就是数据源里的值赋值给text  -->
			<!-- 定义头部名称时 slot等于columns中的slots的title的值，然后赋值 -->
			<span slot="action" slot-scope="text, record, index">
				<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
			</span>
		</a-table>
		<div>
			<a-modal :title="tanDatas.studio_name" :visible="visible" cancelType="primary" width="60%" @cancel="cancelClick" :centered="true">
				<div class="box">
					<div>工作室名称：{{ tanDatas.studio_name }}</div>
					<div>负责人：{{ tanDatas.teacher_name }}</div>
					<div v-if="tanDatas.grade != ''">工作室等级：{{ tanDatas.grade == 0 ? "C级" : tanDatas.grade == 1 ? "B级" : "A级" }}</div>
					<div>
						工作室工作内容：
						<p class="sj">{{ tanDatas.job_content }}</p>
					</div>
					<a-button type="primary" class="downLoad" v-if="hasFile" @click="download(tanDatas.id)">下载附件</a-button>
				</div>
				<div slot="footer">
					<a-button @click="handleCancel" :loading="cancelLoading">不同意</a-button>
					<a-button @click="handleOk" type="primary">同意</a-button>
				</div>
				<!-- <a-modal title="请输入置换方案编号" :visible="bianhao" :centered="true" @cancel="() => (this.bianhao = false)">
					<a-input placeholder="请输入置换方案编号" v-model="examine.project_code" />
					<div slot="footer">
						<a-button @click="() => (this.bianhao = false)">取消</a-button>
						<a-button @click="sub_OK" type="primary" :loading="okLoading">提交</a-button>
					</div>
				</a-modal> -->
				<a-divider>课程置换方案名单</a-divider>
				<a-table :columns="columns2" :data-source="tableDatas" :confirm-loading="okLoading" :pagination="false" rowKey="id" bordered>
					<!-- slot中的name是指scopedSlots中customRender  slot-scope="text"的text就是数据源里的值赋值给text  -->
					<!-- 定义头部名称时 slot等于columns中的slots的title的值，然后赋值 -->
					<span slot="action" slot-scope="text, record, index">
						<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
					</span>
				</a-table>
				<a-divider>直接管理单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>直接管理单位：{{ tanDatas.management_unit_name }}</div>
				<div>审核人：{{ tanDatas.management_unit_signer }}</div>
				<div>审核时间：{{ tanDatas.management_unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.management_unit_feedback_content }}</p>
				</div>
				<a-divider>监管单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>监管单位:{{ tanDatas.regulatory_unit_name }}</div>
				<div>审核人：{{ tanDatas.regulatory_unit_signer }}</div>
				<div>审核时间：{{ tanDatas.regulatory_unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.regulatory_unit_feedback_content }}</p>
				</div>
				<a-divider>受理单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>受理单位：{{ tanDatas.unit_title }}</div>
				<div>审核人：{{ tanDatas.unit_signer }}</div>
				<div>审核时间：{{ tanDatas.unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.unit_feedback_content }}</p>
				</div>
				<a-divider>教务处审核</a-divider>
				<div class="sub_input">
					<a-input type="text" placeholder="请输入审核人姓名" v-model="examine.signer" />
				</div>
				<a-textarea placeholder="请输入审核意见" v-model="examine.content" :rows="5" />
			</a-modal>
		</div>
	</div>
</template>

<script>
	const columns = [
		{
			title: "记录id",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "工作室名称",
			dataIndex: "studio_name",
			key: "studio_name",
		},
		{
			title: "负责人姓名",
			dataIndex: "teacher_name",
			key: "teacher_name",
		},
		{
			title: "申请时间",
			key: "apply_time",
			dataIndex: "apply_time",
		},
		{
			title: "操作",
			key: "action",
			scopedSlots: { customRender: "action" },
		},
	];
	const columns2 = [
		{
			title: "所抵换的课程或课程组",
			dataIndex: "course",
			key: "course",
		},
		{
			title: "抵换方式",
			dataIndex: "way",
			key: "way",
		},
	];
	import { courseSchemeGetTable, acadFeedBackCourseReplace, courseReplaceSchemeCheck, downloadCourseReplaceScheme } from "../../../../../network/api";
	export default {
		props: ["datas"],
		data() {
			return {
				columns,
				columns2,
				// 弹框
				visible: false,
				bianhao: false,
				// 弹框数据
				tanDatas: {},
				// loading
				cancelLoading: false,
				okLoading: false,
				// 弹框里表格的数据
				tableDatas: [],
				// 审核信息
				examine: {
					signer: "",
					content: "",
					project_code: "",
				},
				// 是否有附件
				hasFile: false,
			};
		},
		methods: {
			download(record_id) {
				window.open("/api/teacherstudio/download/course_replace_scheme?record_id=" + record_id);
			},
			handleClick(text, record, index) {
				courseReplaceSchemeCheck({ record_id: record.id }).then(res => {
					if (res.data.data.result) {
						this.hasFile = true;
					} else {
						this.hasFile = false;
					}
				});
				courseSchemeGetTable({ record_id: record.id }).then(res => {
					this.tanDatas = res.data.data;
					const arr = [];
					let index = 0;
					for (const iterator of this.tanDatas.scheme) {
						let obj = iterator;
						obj.id = index;
						arr.push(obj);
						index++;
					}
					this.tableDatas = arr;
					this.visible = true;
				});
			},
			// 同意
			handleOk(e) {
				if (this.examine.signer == "") {
					this.$message.warning("请填写审核人！");
					return;
				}
				// this.bianhao = true;
				this.okLoading = true;
				// record_id	整型	√	记录id
				// feedback	整型	√	意见，1同意，2拒绝
				// content	字符串		意见内容
				// signer	整型	√	审批人
				const obj = {
					record_id: this.tanDatas.id,
					feedback: 1,
					...this.examine,
				};
				acadFeedBackCourseReplace(obj).then(res => {
					this.$emit("againData");
					this.visible = false;
					this.okLoading = false;
					// this.bianhao = false;
					if (res.data.code == 1) {
						this.$message.success("操作成功！");
					} else {
						this.$message.error("未知错误！");
					}
					this.examine = {
						signer: "",
						content: "",
						project_code: "",
					};
				});
			},
			handleCancel(e) {
				if (this.examine.signer == "") {
					this.$message.warning("请填写审核人！");
					return;
				}
				this.cancelLoading = true;
				// record_id	整型	√	记录id
				// feedback	整型	√	意见，1同意，2拒绝
				// content	字符串		意见内容
				// signer	整型	√	审批人
				const obj = {
					record_id: this.tanDatas.id,
					feedback: 2,
					...this.examine,
				};
				acadFeedBackCourseReplace(obj).then(res => {
					this.$emit("againData");
					this.visible = false;
					this.cancelLoading = false;
					if (res.data.code == 1) {
						this.$message.success("操作成功！");
					} else {
						this.$message.error("未知错误！");
					}
					this.examine = {
						signer: "",
						content: "",
						project_code: "",
					};
				});
			},
			sub_OK() {
				this.okLoading = true;
				// record_id	整型	√	记录id
				// feedback	整型	√	意见，1同意，2拒绝
				// content	字符串		意见内容
				// signer	整型	√	审批人
				const obj = {
					record_id: this.tanDatas.id,
					feedback: 1,
					...this.examine,
				};
				acadFeedBackCourseReplace(obj).then(res => {
					this.$emit("againData");
					this.visible = false;
					this.okLoading = false;
					// this.bianhao = false;
					if (res.data.code == 1) {
						this.$message.success("操作成功！");
					} else {
						this.$message.error("未知错误！");
					}
					this.examine = {
						signer: "",
						content: "",
						project_code: "",
					};
				});
			},
			cancelClick() {
				// 关闭
				this.visible = false;
			},
		},
		created() {},
	};
</script>

<style lang="less" scoped>
	.content {
		.ant-collapse-content-box {
			background: red;
		}
	}
	.box {
		font-size: 16px;
		div {
			padding-top: 5px;
		}
		.downLoad {
			float: right;
			margin-right: 20px;
		}
	}
	.sub_input {
		width: 200px;
		margin-bottom: 20px;
	}
	.sj {
		text-indent: 2em;
	}
</style>
